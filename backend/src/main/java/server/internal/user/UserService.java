package server.internal.user;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.ExperienceLevel;
import server.enums.roles.UserRole;
import server.enums.status.ApplicationStatus;
import server.enums.status.FairStatus;
import server.enums.status.RequestStatus;
import server.enums.status.TourStatus;
import server.enums.types.ApplicationType;
import server.enums.types.DashboardCategory;
import server.enums.types.RequestType;
import server.models.DTO.*;
import server.models.events.FairApplication;
import server.models.events.FairRegistry;
import server.models.events.TourApplication;
import server.models.events.TourRegistry;
import server.models.people.Advisor;
import server.models.people.Guide;
import server.models.people.User;
import server.models.requests.AdvisorPromotionRequest;
import server.models.requests.GuideAssignmentRequest;
import server.models.requests.Request;
import server.models.requests.TourModificationRequest;
import server.models.time.ZTime;

import java.util.*;
import java.util.stream.Stream;

@Service
public class UserService {

    @Autowired
    DTOFactory dto;

    @Autowired
    Database database;

    @Autowired
    AuthService authService;

    public List<Map<String, Object>> getDashboardEvents(String auth, String category_s) {

        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        String userID = JWTService.getSimpleton().decodeUserID(auth);

        DashboardCategory category = null;
        try {
            category = DashboardCategory.valueOf(category_s);
        } catch (Exception E) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category!");
        }
        List<Map<String, Object>> response = new ArrayList<>();

        User user = database.people.fetchUser(userID);

        List<Object> sortby = List.of(TourStatus.CONFIRMED, TourStatus.ONGOING, FairStatus.ONGOING, FairStatus.CONFIRMED);
        if (category.equals(DashboardCategory.OWN_EVENT)) {
            response.addAll(
                    database.tours.fetchTours().entrySet().stream().filter(
                            e -> e.getValue().getGuides().contains(userID) && sortby.contains(e.getValue().getTourStatus())
                    ).map(
                            e -> dto.simpleEvent(e.getValue())
                    ).toList()
            );
            response.addAll(
                    database.fairs.fetchFairs().entrySet().stream().filter(
                            e -> e.getValue().getGuides().contains(userID) && sortby.contains(e.getValue().getFair_status())
                    ).map(
                            e -> dto.simpleEvent(e.getValue())
                    ).toList()
            );
        }
        if (category.equals(DashboardCategory.EVENT_INVITATION)) {
            response.addAll(
                    database.requests.getGuideAssignmentRequests()
                            .stream()
                            .filter(r -> r.getStatus().equals(RequestStatus.PENDING))
                            .filter(r -> r.getGuide_id().equals(userID))
                            .map(
                                            r -> {
                                                Map<String, Object> event = null;
                                                try {
                                                    event = dto.simpleEvent(database.tours.fetchTour(r.getEvent_id()));
                                                } catch (Exception e) {
                                                    try {
                                                        event = dto.simpleEvent(database.fairs.fetchFairs().get(r.getEvent_id()));
                                                    } catch (Exception e2) {
                                                        return null;
                                                    }
                                                }
                                                event.put("event_id", r.getEvent_id());
                                                return event;
                                            }
                            ).toList());
        }

        if (category.equals(DashboardCategory.GUIDELESS)) {
            if (user.getRole().equals(UserRole.ADVISOR) && user instanceof Advisor) {
                response.addAll(
                        database.tours.fetchTours().entrySet().stream().filter(
                                e -> e.getValue().getGuides().isEmpty() && ((Advisor) user).getResponsibleFor().contains(e.getValue().getStarted_at().getDate().getDayOfWeek())
                        ).map(
                                e -> dto.simpleEvent(e.getValue())
                        ).toList()
                );
            }
        }

        if (category.equals(DashboardCategory.PENDING_APPLICATION)) {
            if (authService.check(auth, Permission.AR_FAIR_INVITATIONS)) {
                response.addAll(
                        database.applications.getAppicationsOfType(ApplicationType.FAIR).entrySet().stream()
                                .filter(
                                        e -> e.getValue().getStatus().equals(ApplicationStatus.RECEIVED)
                                )
                                .map(e -> {
                                            if (e.getValue() instanceof FairApplication) {
                                                return dto.simpleEvent((FairApplication) e.getValue(), e.getKey());
                                            }
                                            return null;
                                        }
                                ).toList()
                );
            }
            response.addAll(
                    database.applications.getAppicationsOfType(ApplicationType.TOUR).entrySet().stream()
                            .filter(
                                    e -> e.getValue().getStatus().equals(ApplicationStatus.RECEIVED)
                            )
                            .map(e -> {
                                if (e.getValue() instanceof TourApplication) {
                                    return dto.simpleEvent((TourApplication) e.getValue(), e.getKey());
                                }
                                System.out.println("Invalid tour application");
                                return null;
                            }
                    ).toList()
            );
        }



        if (category.equals(DashboardCategory.PENDING_MODIFICATION)) {
            response.addAll(
                    database.requests.getRequestsOfType(RequestType.TOUR_MODIFICATION, null)
                            .stream()
                            .filter(r -> r.getStatus().equals(RequestStatus.PENDING))
                            .filter(r -> {
                                try {
                                    return database.tours.fetchTour(((TourModificationRequest) r).getTour_id()).getAccepted_time().getDate().getDayOfWeek().equals(((Advisor) user).getResponsibleFor());
                                } catch (Exception e) {
                                    return false;
                                }
                            })
                            .map(r -> dto.simpleEvent((TourModificationRequest) r, r.getRequest_id())).toList()
            );
        }

        return response.stream().filter(Objects::nonNull).toList();
    }

    public List<Map<String, Object>> getAdvisorOffers(String auth, String guide_name, String type, String from_date_s, String to_date_s) {
        if (!authService.check(auth, Permission.AR_GUIDE_APPLICATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        List<Request> offers = database.requests.getRequestsOfType(RequestType.PROMOTION, null);
        List<User> users = database.people.fetchUsers();
        SorensenDice alg = new SorensenDice();
        if (!guide_name.isEmpty()) {
            offers = offers.stream().filter(
                    r -> alg.similarity(database.people.fetchUser(r.getRequested_by().getBilkent_id()).getProfile().getName().toLowerCase(), guide_name.toLowerCase()) > 0.6
            ).toList();
        }

        if (!type.isEmpty()) {
            offers = offers.stream().filter(
                    r -> {
                        try {
                            return r.getStatus().equals(RequestStatus.valueOf(type));
                        } catch (Exception e) {
                            return false;
                        }
                    }
            ).toList();
        }

        offers = offers.stream().filter( r -> r instanceof AdvisorPromotionRequest).toList();


        return offers.stream().map( o -> {
            try {
                return dto.advisorOffer((AdvisorPromotionRequest) o, database.people.fetchUser(((AdvisorPromotionRequest) o).getGuide_id()).getProfile().getName());
            } catch (Exception e) {
                return null;
            }
        }).toList();
    }

    public List<Map<String, Object>> searchGuides(String auth, String name, String type) {
        /*if (name.isEmpty() && type.isEmpty()) {
            getSimpleGuides(auth, DTO_UserType.GUIDE);
        }*/

        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Insufficent authorization!");
        }

        List<Map<String, Object>> guides = new ArrayList<>();
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
            System.out.println("Type is " + type);
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

        if (!name.isEmpty()) {
            SorensenDice alg = new SorensenDice();
            guides = guides.stream().filter(
                    g -> alg.similarity(((String) g.get("name")).toLowerCase(), name.toLowerCase()) > 0.6
            ).toList();
        }
        return guides;
    }

    public List<Map<String, Object>> getSimpleGuides(String auth, DTO_UserType type) {
        // validate jwt token
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        List<Map<String, Object>> guides = new ArrayList<>();

        List<Guide> people = database.people.fetchGuides(null);
        people.addAll(database.people.fetchAdvisors(null));
        for (Guide guide : people) {
            if (type == DTO_UserType.TRAINEE) {
                if (guide.getExperience().getExperienceLevel_level() == ExperienceLevel.TRAINEE) {
                    guides.add(dto.simpleGuide(guide));
                }
            } else if (type == DTO_UserType.GUIDE) {
                if (guide.getExperience().getExperienceLevel_level() != ExperienceLevel.TRAINEE) {
                    if (guide.getRole() == UserRole.GUIDE) {
                        guides.add(dto.simpleGuide(guide));
                    }
                }
            } else if (type == DTO_UserType.ADVISOR){
                if (guide.getRole() == UserRole.ADVISOR) {
                    guides.add(dto.simpleGuide(guide));
                }
            }
        }

        return guides;
    }

    public List<Map<String,Object>> getAvailableGuides(String auth, String type, String timeString) {
        // validate jwt token
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        List<Guide> people = database.people.fetchGuides(null);
        people.addAll(database.people.fetchAdvisors(null));

        people = people.stream().filter(
                g -> {
                    if (type.equals("TRAINEE"))
                        return g.getRole().equals(UserRole.GUIDE) && g.getExperience().getExperienceLevel_level().equals(ExperienceLevel.TRAINEE);
                    else if (type.equals("GUIDE"))
                        return g.getRole().equals(UserRole.GUIDE) && !g.getExperience().getExperienceLevel_level().equals(ExperienceLevel.TRAINEE);
                    else
                        return g.getRole().equals(UserRole.ADVISOR);
                }
        ).toList();

        ZTime time = new ZTime(timeString);

        List<TourRegistry> tours = database.tours.fetchTours().values().stream().filter(
                tourRegistry -> tourRegistry.getTourStatus().equals(TourStatus.CONFIRMED) && !tourRegistry.getAccepted_time().inRange(time, 2)
        ).toList();

        List<FairRegistry> fairs = database.fairs.fetchFairs().values().stream().filter(
                fairRegistry -> fairRegistry.getFair_status().equals(FairStatus.CONFIRMED) && !fairRegistry.getStarts_at().inRange(time, 24)
        ).toList();

        people = people.stream().filter(
                p -> !(tours.stream().anyMatch(t -> t.getGuides().contains(p.getBilkent_id()))
                        && fairs.stream().anyMatch(f -> f.getGuides().contains(p.getBilkent_id()))
                )).toList();

        SorensenDice alg = new SorensenDice();

        people = people.stream().sorted(
                (p,o) -> {
                    int total = 0;
                    if (p.getExperience().getExperienceLevel_level().equals(o.getExperience().getExperienceLevel_level())) {
                        total += 0;
                    } else if (p.getExperience().getExperienceLevel_level().equals(ExperienceLevel.SENIOR)) {
                        total += 1;
                    } else if (p.getExperience().getExperienceLevel_level().equals(ExperienceLevel.JUNIOR)) {
                        if (o.getExperience().getExperienceLevel_level().equals(ExperienceLevel.SENIOR)) {
                            total -= 1;
                        } else {
                            total += 1;
                        }
                    } else if (p.getExperience().getExperienceLevel_level().equals(ExperienceLevel.TRAINEE)) {
                        total -= 1;
                    }
                    return total;
                }).toList();

        return people.stream().map(dto::simpleGuide).toList();
    }

    public boolean amEnrolled(String auth, String event_id) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        String userID = JWTService.getSimpleton().decodeUserID(auth);

        try {
            TourRegistry tour = database.tours.fetchTour(event_id);
            return tour.getGuides().contains(userID);
        } catch (Exception e) {
            try {
                FairRegistry fair = database.fairs.fetchFairs().get(event_id);
                return fair.getGuides().contains(userID);
            } catch (Exception e2) {
                return false;
            }
        }
    }

    public boolean amInvited(String auth, String event_id) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        String userID = JWTService.getSimpleton().decodeUserID(auth);

        try {
            return database.requests.getGuideAssignmentRequests().stream().anyMatch(
                    r -> r.getEvent_id().equals(event_id) && r.getGuide_id().equals(userID)
            );
        } catch (Exception e) {
            return false;
        }
    }

    public List<Map<String, Object>> getInvitations(String auth, String my_invitations) {
        if (!authService.check(auth)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (!authService.check(auth, Permission.ASSIGN_OTHER_GUIDE) && !my_invitations.isEmpty()) {
            if (!Boolean.valueOf(my_invitations)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view other people's invitations!");
            }
        }
        final boolean onlyMine;
        try {
            onlyMine = my_invitations.isEmpty() ? true : Boolean.parseBoolean(my_invitations);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid parameter!");
        }

        String userID = JWTService.getSimpleton().decodeUserID(auth);
        List<Map<String, Object>> invitations = new ArrayList<>();

        try {
            database.requests.getGuideAssignmentRequests().stream()
                    .filter(
                            r -> !onlyMine || r.getRequested_by().getBilkent_id().equals(userID)
                    ).map(dto::eventInvitation).forEach(invitations::add);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while fetching / parsing invitations!");
        }

        return invitations;
    }
}
