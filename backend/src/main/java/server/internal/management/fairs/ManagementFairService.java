package server.internal.management.fairs;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.status.ApplicationStatus;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTOFactory;
import server.models.DTO.DTO_Fair;
import server.models.events.FairRegistry;
import server.models.schools.HighschoolRecord;
import server.models.time.ZTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ManagementFairService {

    @Autowired
    Database database;

    @Autowired
    MailServiceGateway mailService;

    @Autowired
    AuthService authService;

    @Autowired
    DTOFactory dto;
    public List<Map<String, Object>> getFairs(
            String auth,
            String status,
            boolean guide_not_assigned,
            boolean enrolled_in_fair,
            String school_name,
            String to_date,
            String from_Date,
            boolean filter_guide_missing,
            boolean filter_trainee_missing) {

        // validate token and permission
        if(!authService.check(auth, Permission.AR_FAIR_INVITATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view fairs!");
        }

        SorensenDice sd = new SorensenDice();

        List<Map.Entry<String, FairRegistry>> fairs = database.fairs.fetchFairs().entrySet() .stream()
                .filter(f -> status.isEmpty() || f.getValue().getFair_status().name().equals(status))
                .filter(f -> !guide_not_assigned || f.getValue().getGuides().isEmpty())
                .filter(f -> true) // TODO: find out what enrolled_in_fair does, and kill who wrote it and didn't answer for so long on what it does
                .filter(f -> {
                    if (school_name.isEmpty()) {
                        return true;
                    }
                    HighschoolRecord hs = database.schools.getHighschoolByID(f.getValue().getApplicant().getSchool());
                    if (hs == null) {
                        return false;
                    }

                    return sd.similarity(hs.getTitle().toLowerCase(), school_name.toLowerCase()) > 0.8;
                })
                .filter(f -> to_date.isEmpty() || f.getValue().getStarts_at().getDate().isBefore(new ZTime(to_date).getDate()))
                .filter(f -> from_Date.isEmpty() || f.getValue().getEnds_at().getDate().isAfter(new ZTime(from_Date).getDate()))
                .filter(f -> !filter_guide_missing || f.getValue().getGuides().size() == 0) // TODO: these need to be fixed, but not primary concern
                .filter(f -> !filter_trainee_missing || f.getValue().getGuides().size() == 0).toList();

        List<Map<String, Object>> dtos = new ArrayList<>();

        try {
            dtos = fairs.stream().map(f -> dto.fair(f.getValue())).toList();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error while converting fairs to DTOs!");
            throw new ResponseStatusException(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS, "Error while converting fairs to DTOs!");
        }

        return dtos;
    }

    public void respondToFairInvitation(String auth, String fairID, String response) {
        // validate token and permission
        if (!authService.check(auth, Permission.AR_FAIR_INVITATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view fairs!");
        }

        // check if fair exists
        if (database.fairs.fetchFairs().keySet().stream().noneMatch(k -> k.equals(fairID))) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Fair does not exist!");
        }

        // check if response is valid
        ApplicationStatus status = null;
        try {
            status = ApplicationStatus.valueOf(response);
        } catch (Exception e) {

        }
        if (status == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid response!");
        }

        FairRegistry fair = database.fairs.fetchFairs().get(fairID);
        fair.setStatus(status);
        database.fairs.updateFair(fair, fairID);

        try {
            Status mailStatus = Status.APPROVAL;
            if (status == ApplicationStatus.REJECTED) {
                mailStatus = Status.REJECTION;
            } else if (status == ApplicationStatus.RECEIVED) {
                mailStatus = Status.RECIEVED;
            }
            mailService.sendMail(
                    fair.getApplicant().getContact_info().getEmail(),
                    Concerning.EVENT_APPLICANT,
                    About.FAIR_APPLICATION,
                    mailStatus,
                    Map.of(
                            "event_id", fairID,
                            "event_name", fair.getFair_name(),
                            "status", status.toString()
                    )

            );
        } catch (Exception e) {
            System.out.println("Error while trying to send a mail");
        }
    }
}
