package server.respond;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Passkey;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.status.*;
import server.enums.types.ApplicationType;
import server.enums.types.RequestType;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.Application;
import server.models.requests.AdvisorPromotionRequest;
import server.models.requests.GuideAssignmentRequest;
import server.models.requests.Request;
import server.models.events.*;
import server.models.people.Guide;
import server.models.people.GuideApplication;
import server.models.requests.TourModificationRequest;
import server.models.time.ZTime;

import java.util.List;
import java.util.Map;

@Service
public class RespondService {

    @Autowired
    MailServiceGateway mail;

    @Autowired
    Database database;

    @Autowired
    AuthService authService;

    public void respondGuideApplication(String auth, String applicant_id, boolean response) {
        if (!authService.check(auth, Permission.AR_GUIDE_APPLICATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this application!");
        }

        Map<String, Application> applications = database.applications.getAppicationsOfType(ApplicationType.GUIDE);

        Map.Entry<String, Application> applicationEntry =  applications.entrySet().stream().filter(e -> ((GuideApplication) e.getValue()).getBilkent_id().equals(applicant_id)).findFirst().orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No application found for the given bilkent id!")
        );

        GuideApplication application = (GuideApplication) applicationEntry.getValue();
        application.setStatus(response ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);

        database.applications.updateApplication(applicationEntry.getKey(), ApplicationType.GUIDE, response ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);

        Guide guide = Guide.fromApplication(application);

        if (response) {
            guide.setStatus(UserStatus.ACTIVE);
            database.people.addUser(guide);
        }

        mail.sendMail(
                guide.getProfile().getContact_info().getEmail(),
                Concerning.GUIDE,
                About.GUIDE_APPLICATION,
                response ? Status.APPROVAL : Status.REJECTION,
                Map.of("pass", guide.getAuthInfo().getPassword())
        );
    }

    public void respondToTourApplication(String auth, String application_id, String time) {

        if (!authService.check(auth, Permission.AR_TOUR_REQUESTS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this application!");
        }

        Map<String, Application> applications = database.applications.getAppicationsOfType(ApplicationType.TOUR);
        Map.Entry<String, Application> applicationEntry = applications.entrySet().stream().filter(e -> e.getKey().equals(application_id)).findFirst().orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No application found for the given application id!")
        );

        TourApplication application = (TourApplication) applicationEntry.getValue();
        boolean response = !time.isEmpty();

        if (application.getRequested_hours().stream().noneMatch(
                rh -> rh.getDate().equals(new ZTime(time).getDate()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Accepted time is not in the list of requested times!");
        }

        application.setStatus(response ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);
        database.applications.updateApplication(applicationEntry.getKey(), ApplicationType.TOUR, response ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);

        String passkey = "";
        if (response) {
            TourRegistry tour = new TourRegistry(application);
            tour.setTour_status(TourStatus.CONFIRMED);
            tour.setAccepted_time(new ZTime(time));
            tour.setTour_id(application_id);
            database.tours.addTour(tour);

            passkey = database.auth.createTourKey(tour.getTour_id(), tour.getAccepted_time());
            System.out.println("For tour " + tour.getTour_id() + " created passkey :" + passkey + ":");
        }

        mail.sendMail(
                application.getApplicant().getContact_info().getEmail(),
                Concerning.EVENT_APPLICANT,
                About.TOUR_APPLICATION,
                response ? Status.APPROVAL : Status.REJECTION,
                Map.of("name", application.getApplicant().getName(),
                        "passkey", passkey)
        );
    }

    public void respondToFairApplication(String auth, String application_id, boolean response) {
        if (!authService.check(auth, Permission.AR_FAIR_INVITATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this application!");
        }

        Map<String, Application> applications = database.applications.getAppicationsOfType(ApplicationType.FAIR);
        System.out.println("Trying to find fair application " + application_id);
        for (Map.Entry<String, Application> entry : applications.entrySet()) {
            System.out.println("Found fair application " + entry.getKey());
        }
        Map.Entry<String, Application> applicationEntry = applications.entrySet().stream().filter(e -> e.getKey().equals(application_id)).findFirst().orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No application found for the given application id!")
        );

        FairApplication application = (FairApplication) applicationEntry.getValue();

        application.setStatus(response ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);
        database.applications.updateApplication(applicationEntry.getKey(), ApplicationType.TOUR, response ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);

        String passkey = "";
        if (response) {
            FairRegistry fair = new FairRegistry(application);
            fair.setFair_status(FairStatus.CONFIRMED);
            database.fairs.addFair(fair);

            passkey = database.auth.createTourKey(fair.getFair_id(), fair.getStarts_at());
        }

        mail.sendMail(
                application.getApplicant().getContact_info().getEmail(),
                Concerning.EVENT_APPLICANT,
                About.FAIR_APPLICATION,
                response ? Status.APPROVAL : Status.REJECTION,
                Map.of("name", application.getApplicant().getName(),
                        "passkey", passkey)
        );
    }

    public void respondToTourModification(String auth, String request_id, boolean response) {
        // get request
        List<Request> requests = database.requests.getRequestsOfType(RequestType.TOUR_MODIFICATION, request_id);
        TourModificationRequest request = (TourModificationRequest) requests.stream().findFirst().orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No request found for the given request id!")
        );

        // check authentication respective to the requested_by
        if (request.getRequested_by().getBilkent_id().isEmpty()) {
            // use bilkent id
            if (!authService.check(auth, Permission.AR_TOUR_REQUESTS)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this request!");
            }
        } else {
            if (!authService.checkWithPasskey(auth, request.getTour_id(), Permission.AR_TOUR_REQUESTS)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this request!");
            }
        }

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already responded!");
        }

        request.setStatus(response ? RequestStatus.APPROVED : RequestStatus.REJECTED);
        database.requests.updateRequest(request);

        if (response) {
           TourRegistry tour = database.tours.fetchTour(request.getTour_id());
           tour.modify(request.getModifications());
           tour.setStatus(ApplicationStatus.APPROVED);
           tour.setTour_status(TourStatus.CONFIRMED);

           tour.getGuides().forEach( s -> {
               try {
                   Guide guide = database.people.fetchGuides(s).get(0);
                   mail.sendMail(

                           guide.getProfile().getContact_info().getEmail(),
                           Concerning.GUIDE,
                           About.TOUR_MODIFICATION,
                           Status.APPROVAL,
                           Map.of("tour_id", tour.getTour_id())
                   );
               } catch (Exception e) {}
           });

           tour.setGuides(List.of());
           database.tours.updateTour(tour, tour.getTour_id());
        }

        mail.sendMail(
                request.getRequested_by().getContactInfo().getEmail(),
                Concerning.EVENT_APPLICANT,
                About.TOUR_MODIFICATION,
                response ? Status.APPROVAL : Status.REJECTION,
                Map.of("tour_id", request.getTour_id())
        );
    }


    public void respondToFairGuideInvite(String auth, String invite_id, boolean response) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this application!");
        }

        List<Request> requests = database.requests.getRequestsOfType(RequestType.ASSIGNMENT, invite_id);
        GuideAssignmentRequest request = (GuideAssignmentRequest) requests.stream().filter(
                r -> r.getRequest_id().equals(invite_id)
        ).findFirst().orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No request found for the given request id!")
        );

        String userID = JWTService.getSimpleton().decodeUserID(auth);
        if (!request.getGuide_id().equals(userID)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this request!");
        }

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already responded!");
        }

        request.setStatus(response ? RequestStatus.APPROVED : RequestStatus.REJECTED);

        if (response) {
            try {
                FairRegistry fair = database.fairs.fetchFairs().get(request.getEvent_id());
                List<String> guides = fair.getGuides();

                guides.add(userID);
                fair.setGuides(guides);
                database.fairs.updateFair(fair, fair.getFair_id());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fair not found!");
            }
        }

        database.requests.updateRequest(request);
    }

    public void respondToTourGuideInvite(String auth, String application_id, boolean response) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this application!");
        }

        List<Request> requests = database.requests.getRequestsOfType(RequestType.ASSIGNMENT, application_id);
        GuideAssignmentRequest request = (GuideAssignmentRequest) requests.stream().filter(
                r -> r.getRequest_id().equals(application_id)
        ).findFirst().orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No request found for the given request id!")
        );


        String userID = JWTService.getSimpleton().decodeUserID(auth);
        if (!request.getGuide_id().equals(userID)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this request!");
        }

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already responded!");
        }

        request.setStatus(response ? RequestStatus.APPROVED : RequestStatus.REJECTED);

        if (response) {
            try {
                TourRegistry tour = database.tours.fetchTour(request.getEvent_id());
                List<String> guides = tour.getGuides();

                guides.add(userID);
                tour.setGuides(guides);
                database.tours.updateTour(tour, tour.getTour_id());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fair not found!");
            }
        }

        mail.sendMail(
                request.getRequested_by().getContactInfo().getEmail(),
                Concerning.ADVISOR,
                About.GUIDE_ASSIGNMENT,
                response ? Status.APPROVAL : Status.REJECTION,
                Map.of(
                        "tour_id", request.getEvent_id(),
                        "guide_id", userID
                )
        );

        database.requests.updateRequest(request);
    }

    public void respondToGuidePromotion(String auth, String promotion_id, boolean response) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this application!");
        }

        List<Request> requests = database.requests.getRequestsOfType(RequestType.PROMOTION, promotion_id);
        AdvisorPromotionRequest request = (AdvisorPromotionRequest) requests.stream().filter(
                r -> r.getRequest_id().equals(promotion_id)
        ).findFirst().orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No request found for the given request id!")
        );

        String userID = JWTService.getSimpleton().decodeUserID(auth);

        if (!request.getGuide_id().equals(userID)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to respond to this request!");
        }

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already responded!");
        }

        request.setStatus(response ? RequestStatus.APPROVED : RequestStatus.REJECTED);

        if (response) {
            try {
                Guide guide = database.people.fetchGuides(request.getGuide_id()).get(0);
                database.people.updateUser(guide);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}