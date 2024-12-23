package server.internal.event.fair;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.status.ApplicationStatus;
import server.enums.status.FairStatus;
import server.models.DTO.DTOFactory;
import server.models.events.FairApplication;
import server.models.events.FairRegistry;
import server.models.schools.HighschoolRecord;
import server.models.time.ZTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EventFairService {

    @Autowired
    DTOFactory dto;

    @Autowired
    Database db;

    @Autowired
    AuthService authService;

    public List<Map<String, Object>> searchFairs(
            String auth,
            List<String> status,
            String guide_not_assigned,
            String enrolled_in_fair,
            String school_name,
            String to_date,
            String from_Date,
            String filter_guide_missing,
            String filter_trainee_missing) {

        // validate token and permission
        if(!authService.check(auth, Permission.AR_FAIR_INVITATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view fairs!");
        }

        SorensenDice sd = new SorensenDice();

        List<Map.Entry<String, FairRegistry>> fairs = db.fairs.fetchFairs().entrySet() .stream()
                .filter(f -> status.isEmpty() || f.getValue().getFair_status().name().equals(status))
                .filter(f -> {
                    if (guide_not_assigned.isEmpty()) {
                        return true;
                    }
                    return Boolean.valueOf(guide_not_assigned) == f.getValue().getGuides().isEmpty();
                })
                .filter(f -> true) // TODO: find out what enrolled_in_fair does, and kill who wrote it and didn't answer for so long on what it does
                .filter(f -> {
                    if (school_name.isEmpty()) {
                        return true;
                    }
                    HighschoolRecord hs = db.schools.getHighschoolByID(f.getValue().getApplicant().getSchool());
                    if (hs == null) {
                        return false;
                    }

                    return sd.similarity(hs.getTitle().toLowerCase(), school_name.toLowerCase()) > 0.8;
                })
                .filter(f -> to_date.isEmpty() || f.getValue().getStarts_at().getDate().isBefore(new ZTime(to_date).getDate()))
                .filter(f -> from_Date.isEmpty() || f.getValue().getEnds_at().getDate().isAfter(new ZTime(from_Date).getDate()))
                .filter(f -> {
                    if (filter_guide_missing.isEmpty()) {
                        return true;
                    }
                    return  Boolean.valueOf(filter_guide_missing) == f.getValue().getGuides().isEmpty();
                }) // TODO: these need to be fixed, but not primary concern
                .filter(f -> {
                    if (filter_trainee_missing.isEmpty()) {
                        return true;
                    }
                    return Boolean.valueOf(filter_trainee_missing) == f.getValue().getGuides().isEmpty();
                }).toList();

        List<Map<String, Object>> dtos = new ArrayList<>();

        try {
            dtos.addAll(fairs.stream().map(f -> dto.simpleEvent(f.getValue())).toList());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error while converting fairs to DTOs!");
            throw new ResponseStatusException(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS, "Error while converting fairs to DTOs!");
        }

        if (status.contains(FairStatus.RECEIVED.name())) {
            db.applications.getFairApplications().entrySet().stream()
                    .filter(a -> a.getValue().getStatus() == ApplicationStatus.RECEIVED)
                    .forEach(a -> {
                        try {
                            dtos.add(dto.simpleEvent(a.getValue(), a.getKey()));
                        } catch (Exception e) {
                            e.printStackTrace();
                            System.out.println("Error while converting fair applications to DTOs!");
                        }
                    });
        }

        return dtos;
    }

    public Map<String, Object> getFair(String auth, String fair_id) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to access this");
        }

        // get fair
        Map<String, FairRegistry> fairs = db.fairs.fetchFairs();
        if (!fairs.containsKey(fair_id)) {
            Map<String, FairApplication> applications = db.applications.getFairApplications();
            if (!applications.containsKey(fair_id)) {
                throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Fair not found!");
            }
            return dto.fair((new FairRegistry(applications.get(fair_id))).setFair_status(FairStatus.RECEIVED));
        }

        // return fair
        return dto.fair(fairs.get(fair_id));
    }
}
