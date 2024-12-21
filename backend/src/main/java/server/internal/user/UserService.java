package server.internal.user;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.dbm.Database;
import server.enums.ExperienceLevel;
import server.enums.roles.UserRole;
import server.enums.status.FairStatus;
import server.enums.status.TourStatus;
import server.enums.types.ApplicationType;
import server.enums.types.DashboardCategory;
import server.models.DTO.DTO_AdvisorOffer;
import server.models.DTO.DTO_SimpleEvent;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.DTO_UserType;
import server.models.events.FairApplication;
import server.models.events.FairRegistry;
import server.models.events.TourRegistry;
import server.models.people.Guide;
import server.models.time.ZTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserService {


    @Autowired
    Database database;

    public List<DTO_SimpleEvent> getDashboardEvents(String auth, String category_s) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }
        String userID = JWTService.getSimpleton().decodeUserID(auth);

        DashboardCategory category = DashboardCategory.EVENT_INVITATION;
        try {
            category = DashboardCategory.valueOf(category_s);
        } catch (Exception E) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category!");
        }
        List<DTO_SimpleEvent> response = new ArrayList<>();
        if (category == DashboardCategory.GUIDELESS) {
            response.addAll(
                    database.tours.fetchTours()
                            .entrySet().stream().map(
                                    e -> DTO_SimpleEvent.fromEvent(e.getValue()))
                            .toList());
            response.addAll(
                    database.fairs.fetchFairs()
                            .entrySet().stream().map(
                                    e -> DTO_SimpleEvent.fromEvent(e.getValue()))
                            .toList());
        } else if (category == DashboardCategory.EVENT_INVITATION) {
        }

        return response;
    }

    private DTO_SimpleEvent mapFairInviteToSimpleEvent(FairApplication application) {
        DTO_SimpleEvent event = new DTO_SimpleEvent();

        return event;
    }

    public List<DTO_AdvisorOffer> getAdvisorOffers(String auth, String guide_name, String type, String from_date_s, String to_date_s) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization!");
        }

        if (!List.of(UserRole.COORDINATOR, UserRole.DIRECTOR).contains(JWTService.getSimpleton().getUserRole(auth))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unsatisfactory permissions!");
        }

        List<DTO_AdvisorOffer> offers = new ArrayList<>();

        // TODO : structure the dbs for the offers, add response endpoint for it

        return offers;
    }

    public List<DTO_SimpleGuide> searchGuides(String auth, String name, String type) {
        if (name.isEmpty() && type.isEmpty()) {
            return getSimpleGuides(auth, DTO_UserType.GUIDE);
        }

        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        List<DTO_SimpleGuide> guides = new ArrayList<>();
        if (type.isEmpty()) {
            guides.addAll(
                    getSimpleGuides(auth, DTO_UserType.GUIDE)
            );
            guides.addAll(
                    getSimpleGuides(auth, DTO_UserType.TRAINEE)
            );
            guides.addAll(
                    getSimpleGuides(auth, DTO_UserType.ADVISOR)
            );
        } else {
            DTO_UserType userType ;
            try {
                userType = DTO_UserType.valueOf(type);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user type!");
            }
            guides.addAll(
                    getSimpleGuides(auth, userType)
            );
        }

        SorensenDice alg = new SorensenDice();

        if (!name.isEmpty()) {
            guides = guides.stream().filter(
                    g -> alg.similarity(g.getName().toLowerCase(), name.toLowerCase()) > 0.6
            ).toList();
        }
        return guides;
    }

    public List<DTO_SimpleGuide> getSimpleGuides(String authToken, DTO_UserType type) {
        List<DTO_SimpleGuide> guides = new ArrayList<>();
        // validate jwt token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        List<Guide> people = database.people.fetchGuides(null);
        people.addAll(database.people.fetchAdvisors(null));
        for (Guide guide : people) {
            if (type == DTO_UserType.TRAINEE) {
                if (guide.getExperience().getExperienceLevel_level() == ExperienceLevel.TRAINEE) {
                    guides.add(DTO_SimpleGuide.fromGuide(guide));
                }
            } else if (type == DTO_UserType.GUIDE) {
                if (guide.getExperience().getExperienceLevel_level() != ExperienceLevel.TRAINEE) {
                    if (guide.getRole() == UserRole.GUIDE) {
                        guides.add(DTO_SimpleGuide.fromGuide(guide));
                    }
                }
            } else if (type == DTO_UserType.ADVISOR){
                if (guide.getRole() == UserRole.ADVISOR) {
                    guides.add(DTO_SimpleGuide.fromGuide(guide));
                }
            }
        }

        return guides;
    }

    public List<DTO_SimpleGuide> getAvailableGuides(String authToken, DTO_UserType type, String timeString) {
        List<DTO_SimpleGuide> guides = new ArrayList<>();
        // validate jwt token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        List<Guide> people = database.people.fetchGuides(null);
        people.addAll(database.people.fetchAdvisors(null));

        for (Guide guide : people) {
            if (type == DTO_UserType.TRAINEE) {
                if (guide.getExperience().getExperienceLevel_level() == ExperienceLevel.TRAINEE) {
                    guides.add(DTO_SimpleGuide.fromGuide(guide));
                }
            } else if (type == DTO_UserType.GUIDE) {
                if (guide.getExperience().getExperienceLevel_level() != ExperienceLevel.TRAINEE) {
                    guides.add(DTO_SimpleGuide.fromGuide(guide));
                }
            }
        }

        ZTime time = new ZTime(timeString);

        // now do a time check and see if they are available
        Map<String,TourRegistry> tours = database.tours.fetchTours();
        for (TourRegistry tour : tours.values()) {
            if (tour.getTourStatus() == TourStatus.CONFIRMED) {
                for (Guide guide : people) {

                    if (tour.getGuides().contains(guide.getBilkent_id())) {
                        if (tour.getAccepted_time().inRange(time, 1)) {
                            guides.remove(DTO_SimpleGuide.fromGuide(guide));
                        }
                    }
                }
            }
        }

        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();
        for (FairRegistry fair : fairs.values()) {
            if (fair.getFair_status() == FairStatus.ACCEPTED) {
                for (Guide guide : people) {
                    if (fair.getGuides().contains(guide.getBilkent_id())) {
                        if (fair.getStarts_at().inRange(time, 24)) {
                            guides.remove(DTO_SimpleGuide.fromGuide(guide));
                        }
                    }
                }
            }
        }

        return guides;
    }
}
