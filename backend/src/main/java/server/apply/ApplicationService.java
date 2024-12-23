package server.apply;

import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Passkey;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.status.ApplicationStatus;
import server.enums.status.FairStatus;
import server.enums.status.RequestStatus;
import server.enums.status.TourStatus;
import server.enums.types.ApplicationType;
import server.enums.types.RequestType;
import server.mailService.MailServiceGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTOFactory;
import server.models.events.FairApplication;
import server.models.events.FairRegistry;
import server.models.events.TourApplication;
import server.models.events.TourRegistry;
import server.models.people.GuideApplication;
import server.models.requests.Requester;
import server.models.requests.TourModificationRequest;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ApplicationService {
    @Autowired
    private Database db;

    @Autowired
    private MailServiceGateway mailServiceGateway;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthService authService;

    @Autowired
    DTOFactory dto;

    public void cancelEvent(String auth, String event_id, Map<String,Object> body) {
        if (!authService.checkWithPasskey(auth, event_id)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized for this action!");
        }

        Map<String, TourRegistry> tours = db.tours.fetchTours();
        Map<String, FairRegistry> fairs = db.fairs.fetchFairs();

        String reason = (String) body.get("reason");

        if (tours.containsKey(event_id)) {
            TourRegistry tour = tours.get(event_id);
            tour.setTour_status(TourStatus.CANCELLED);
            db.tours.updateTour(tour, tour.getTour_id());

            try {
                // Notify advisor
                mailServiceGateway.sendMail(
                        db.people.fetchAdvisorForDay(tour.getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                        Concerning.ADVISOR,
                        About.TOUR_MODIFICATION,
                        Status.CANCELLED,
                        Map.of(
                                "tour_id", tour.getTour_id(),
                                "reasoning", reason
                        )
                );
            } catch (Exception E) {
                E.printStackTrace();
                System.out.println("Failed to notify the advisor for the day for a new tour modification request.");
            }

            // notify applicant
            try {
                mailServiceGateway.sendMail(
                    tour.getApplicant().getContact_info().getEmail(),
                    Concerning.EVENT_APPLICANT,
                    About.TOUR_MODIFICATION,
                    Status.CANCELLED,
                    Map.of(
                        "tour_id", tour.getTour_id(),
                        "reasoning", reason
                    )
                );

            } catch (Exception E) {
                System.out.println("Failed to notify the applicant for the tour cancellation " + event_id);
            }

            // notify the guides
            tour.getGuides().forEach(
                    guid -> {
                        try {
                            mailServiceGateway.sendMail(
                                    db.people.fetchUser(guid).getProfile().getContact_info().getEmail(),
                                    Concerning.GUIDE,
                                    About.TOUR_MODIFICATION,
                                    Status.CANCELLED,
                                    Map.of(
                                            "tour_id", tour.getTour_id(),
                                            "reasoning", reason
                                    )
                            );
                        } catch (Exception E) {
                            System.out.println("There was an error while notifying the guide about tour cancellation " + event_id);
                        }
                    }
            );


        } else if (fairs.containsKey(event_id)) {
            FairRegistry fair = fairs.get(event_id);
            fair.setFair_status(FairStatus.CANCELLED);
            db.fairs.updateFair(fair, fair.getFair_id());

            try {
                // Notify advisor
                mailServiceGateway.sendMail(
                        db.people.fetchAdvisorForDay(fair.getStarts_at().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                        Concerning.ADVISOR,
                        About.FAIR_MODIFICATION,
                        Status.CANCELLED,
                        Map.of(
                                "fair_id", fair.getFair_id(),
                                "reasoning", reason
                        )
                );
            } catch (Exception E) {
                E.printStackTrace();
                System.out.println("Failed to notify the advisor for the day for a new tour modification request.");
            }


            try {
                // notify applicant
                mailServiceGateway.sendMail(
                        fair.getApplicant().getContact_info().getEmail(),
                        Concerning.EVENT_APPLICANT,
                        About.FAIR_MODIFICATION,
                        Status.CANCELLED,
                        Map.of(
                                "fair_id", fair.getFair_id(),
                                "reasoning", reason
                        )
                );
            } catch (Exception E) {
                System.out.println("Failed to notify the applicant for the fair cancellation " + event_id);
            }

            // notify the guides
            fair.getGuides().forEach(
                    guid -> {
                        try {
                            mailServiceGateway.sendMail(
                                    db.people.fetchUser(guid).getProfile().getContact_info().getEmail(),
                                    Concerning.GUIDE,
                                    About.FAIR_MODIFICATION,
                                    Status.CANCELLED,
                                    Map.of(
                                            "fair_id", fair.getFair_id(),
                                            "reasoning", reason
                                    )
                            );
                        } catch (Exception E) {
                            System.out.println("There was an error while notifying the guide about tour cancellation " + event_id);
                        }
                    }
            );
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found!");
        }

        // find all invites, delete them
        db.requests.getGuideAssignmentRequests().stream().filter(
                e -> e.getEvent_id().equals(event_id)
        ).forEach(
                e -> db.requests.deleteRequest(e)
        );
    }

    public String getTourType(String tour_id) {
        TourRegistry tour = null;
        try {
            tour = db.tours.fetchTour(tour_id);
            return tour.getTour_type().name();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found!");
        }
    }


    public void requestChanges(Map<String, Object> changes, String tourID, String passkey) {
        String requester = "";

        if (authService.check(passkey, Permission.REQUEST_TOUR_CHANGES)) {
            requester = JWTService.getSimpleton().decodeUserID(passkey);
        } else if (authService.checkWithPasskey(passkey, tourID, Permission.REQUEST_TOUR_CHANGES)) {
            requester = JWTService.getSimpleton().decodeUserID(passkey);
        }

        // Check if tour exists
        TourRegistry tour = db.tours.fetchTour(tourID);
        if (tour == null) {

            // check if application with given id exists

            TourApplication app = db.applications.getTourApplications().getOrDefault(tourID, null);
            if (app == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found!");
            }

            // if it exists, mark it pending_changes
            app.setStatus(ApplicationStatus.FROZEN);

            // add a request to the system
            TourModificationRequest request = new TourModificationRequest();
            request.setStatus(RequestStatus.PENDING);
            request.setRequested_at(new ZTime(ZonedDateTime.now()));
            request.setRequested_by(new Requester().setBilkent_id(requester).setContactInfo(app.getApplicant().getContact_info()));
            request.setTour_id(tourID);
            request.setNotes((String) changes.get("notes"));
            request.setType(RequestType.TOUR_MODIFICATION);
            TourApplication chang = TourApplication.fromMap(changes);
            chang.setStatus(ApplicationStatus.RECEIVED);
            request.setModifications(chang);

            db.requests.addRequest(request);

            Map<String, Passkey> passkeys = db.auth.getPasskeys();
            Passkey pk = new Passkey();
            pk.setEvent_id(tourID);
            pk.setExpiration(new ZTime(ZonedDateTime.now().plusDays(7)));
            pk.setKey(UUID.randomUUID().toString());
            while (passkeys.containsKey(pk.getKey())) {
                pk.setKey(UUID.randomUUID().toString());
            }

            db.auth.addPasskey(pk);

            // notify the applicant
            mailServiceGateway.sendMail(
                    app.getApplicant().getContact_info().getEmail(),
                    Concerning.EVENT_APPLICANT,
                    About.TOUR_MODIFICATION,
                    Status.RECIEVED,
                    Map.of(
                            "tour_id", tourID,
                            "pass", pk.getKey()
                            )
            );

        }

        // Check if the tour is in a state that can be changed
        if (!tour.getTourStatus().equals(TourStatus.CONFIRMED)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour is not in a state that can be changed!");
        }

        TourApplication modifications = changes.containsKey("requested_majors") ? dto.individualTourApplication(changes) : dto.groupTourApplication(changes);
        // Add changes as a request
        TourModificationRequest request = new TourModificationRequest();
        request.setModifications(modifications);
        request.setRequested_at(new ZTime(ZonedDateTime.now()));
        request.setRequested_by(new Requester().setBilkent_id(requester).setContactInfo(
                requester.isEmpty() ? modifications.getApplicant().getContact_info() : db.people.fetchUser(requester).getProfile().getContact_info()
        ));
        request.setTour_id(tourID);
        request.setType(RequestType.TOUR_MODIFICATION);
        request.setNotes(modifications.getNotes());
        request.setStatus(RequestStatus.PENDING);

        tour.setTour_status(TourStatus.PENDING_MODIFICATION);

        db.tours.updateTour(tour, tourID);
        db.requests.addRequest(request);

        mailServiceGateway.sendMail(
                modifications.getApplicant().getContact_info().getEmail(),
                Concerning.EVENT_APPLICANT,
                About.TOUR_MODIFICATION,
                Status.RECIEVED,
                Map.of("tour_id", tourID)
        );

        try {

            mailServiceGateway.sendMail(
                    db.people.fetchAdvisorForDay(tour.getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                    Concerning.ADVISOR,
                    About.TOUR_MODIFICATION,
                    Status.RECIEVED,
                    Map.of("tour_id", tourID)
            );
        } catch (Exception E) {
            System.out.println("Failed to notify the advisor for the day for a new tour modification request.");
        }
    }

    public boolean isFree(String starts, String ends) {
        ZTime start = new ZTime(starts);
        ZTime end = new ZTime(ends);

        List<TourRegistry> tours =  db.tours.fetchTours().values().stream().toList();
        return tours.stream().anyMatch(
                t -> ZTime.overlap(start, t.getAccepted_time(), end, t.getAccepted_time())
        );
    }

    public void applyToBeGuide(GuideApplication guideApplication) {
        // get application #
        String appliedid = guideApplication.getBilkent_id();
        System.out.println("Recieved an application with id: " + appliedid);
        // check if there is a user with the same id in the system
        if (db.people.fetchUser(appliedid) != null) {
            // A user exists with the same id
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists with the same id");
        }

        if (db.applications.getAppicationsOfType(ApplicationType.GUIDE).values().stream().anyMatch(
                e -> ((GuideApplication) e).getBilkent_id().equals(appliedid))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Application already exists for the given user id!");
        }

        guideApplication.setStatus(ApplicationStatus.RECEIVED);
        // if there is no user, continue
        // check if the application is valid
        if (!guideApplication.isValid()) {
            System.out.println("Invalid application");
            // the application is not valid
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid guide application!");
        }
        // save the guideModel to the database as a guide that is not approved yet (guide experience level)
        db.applications.addApplication(guideApplication);

        mailServiceGateway.sendMail(guideApplication.getProfile().getContact_info().getEmail(), Concerning.GUIDE, About.GUIDE_APPLICATION, Status.RECIEVED, Map.of("name", guideApplication.getProfile().getName()));

    }

    public void applyForATour(TourApplication tourApplication) {
        tourApplication.setStatus(ApplicationStatus.RECEIVED);
        // get application
        // check application validity
        if (!tourApplication.isValid()) {
            // if invalid, send email to the applicant notifying them of invalidity
            // the application is not valid
            System.out.println("Invalid tour application!");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid application!");
        }

        // check if there is a time - collision with another tour

        List<TourRegistry> tours = db.tours.fetchTours().values().stream().toList();
        System.out.println("Checking from " + tours.size() + " tours.");
        List<ZTime> requestedDates = new ArrayList<>(tourApplication.getRequested_hours());
        if (tours != null) {
            for (TourRegistry tour : tours) {
                if (tour.getAccepted_time() != null) {
                    for (ZTime requestedDate : requestedDates) {
                        if (requestedDate.equals(tour.getAccepted_time())) {
                            // this time does not work, remove it from the list
                            requestedDates.remove(requestedDate);
                            break;
                        }
                    }
                }
            }
        }


        if (requestedDates.isEmpty()) {
            // if there is a time collision, set tour status type to "CONFLICT"
            // all requested dates are already taken
            // set status to CONFLICT
            tourApplication.setStatus(ApplicationStatus.FROZEN);
        } else {
            // if there is no conflict, set tour status type to "Recieved"
            tourApplication.setStatus(ApplicationStatus.RECEIVED);
        }

        // save the application to the database
        db.applications.addApplication(tourApplication);
        mailServiceGateway.sendMail(tourApplication.getApplicant().getContact_info().getEmail(), Concerning.EVENT_APPLICANT, About.TOUR_APPLICATION, Status.RECIEVED, Map.of("name", tourApplication.getApplicant().getName()));
    }

    public void applyForAFair(FairApplication application) {
        // check if the application is valid
        if (!application.isValid()) {
            // the application is not valid
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid application");
        }
        {
            // check if a copy of the fair exists within the system
            Map<String, FairRegistry> fairs = db.fairs.fetchFairs();

            if (fairs != null) {
                for (FairRegistry fair : fairs.values()) {
                    if (fair.getApplicant().getSchool().equals(application.getApplicant().getSchool())) {
                        // if the fair exists, reject application
                        // the fair already exists, http OK is enough
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Fair already exists in the system");
                    }
                }
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not fetch fairs from the system");
            }
        }

        // if the fair does not exist, add the fair to the system
        db.applications.addApplication(application);
        try {
            mailServiceGateway.sendMail(
                    application.getApplicant().getContact_info().getEmail(),
                    Concerning.EVENT_APPLICANT,
                    About.FAIR_APPLICATION,
                    Status.RECIEVED,
                    Map.of("name", application.getApplicant().getName())
            );

        } catch (Exception e) {
            System.out.println("Failed to send mail to the applicant for the fair application.");
        }
    }
}
