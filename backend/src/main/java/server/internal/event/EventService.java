package server.internal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.apply.RequestService;
import server.auth.*;
import server.dbm.Database;
import server.enums.roles.UserRole;
import server.enums.status.FairStatus;
import server.enums.status.RequestStatus;
import server.enums.status.TourStatus;
import server.enums.status.UserStatus;
import server.enums.types.ApplicationType;
import server.enums.types.RequestType;
import server.enums.types.TourType;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTOFactory;
import server.models.DTO.DTO_IndividualTour;
import server.models.events.FairRegistry;
import server.models.events.TourApplication;
import server.models.events.TourRegistry;
import server.models.payment.HourlyRate;
import server.models.people.Guide;
import server.models.people.User;
import server.models.people.details.ContactInfo;
import server.models.requests.GuideAssignmentRequest;
import server.models.requests.Requester;
import server.models.review.ReviewRecord;
import server.models.review.ReviewResponse;
import server.models.time.ZTime;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.*;

@Service
public class EventService {

    @Autowired
    DTOFactory dto;

    @Autowired
    JWTService jwtService;

    @Autowired
    Database database;

    @Autowired
    AuthService authService;

    @Autowired
    RequestService requestService;

    @Autowired
    MailServiceGateway mail;

    public void enroll(String auth, String event_id) {
        // People can only enroll themselves in tours, so this is enough
        // TODO : multi-event support

        if (!authService.check(auth, Permission.RU_FROM_TOUR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to enroll in events!");
        }

        // get tours
        String guideID = jwtService.decodeUserID(auth);

        Map<String, TourRegistry> tours = database.tours.fetchTours();

        // check if tour actually exists
        if (!tours.containsKey(event_id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if user is already assigned to the tour
        for (String guideIDe : tours.get(event_id).getGuides()) {
            if (guideIDe.equals(guideID)) {
                return; // the user is already assigned to this tour, but its alright
            }
        }
        TourRegistry tour = tours.get(event_id);

        // assign user to tour
        tour.getGuides().add(guideID);

        // save tour
        database.tours.updateTour(tour, event_id);

        try {
            String email = database.people.fetchAdvisorForDay(tour.getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail();
            mail.sendMail(
                    email,
                    Concerning.ADVISOR,
                    About.GUIDE_ASSIGNMENT,
                    Status.RECIEVED,
                    Map.of("tour_id", event_id)
            );
        } catch (Exception e) {
            System.out.println("There was an error while trying to send an email! Probably couldn't find an advisor for the day");
        }
    }

    public void withdrawFromEvent(String auth, String event_id) {
        if (!authService.check(auth)) { // We do not need permissions to withdraw from a tour!
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized to perform this action.!");
        }

        String userID = JWTService.getSimpleton().decodeUserID(auth);

        // check if tour exists
        Map<String, TourRegistry> tours = database.tours.fetchTours();

        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();
        if (tours.containsKey(event_id)) {
            if (!tours.get(event_id).getGuides().contains(userID)) {return;}

            if (List.of(TourStatus.FINISHED, TourStatus.ONGOING, TourStatus.RECEIVED, TourStatus.REJECTED).contains(tours.get(event_id).getStatus())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can not withdraw from this tour!");
            }

            database.tours.updateTour(tours.get(event_id).setGuides(tours.get(event_id).getGuides().stream().filter(id -> !id.equals(userID)).toList()), event_id);
            // notify advisor
            try {
                mail.sendMail(
                        database.people.fetchAdvisorForDay(tours.get(event_id).getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                        Concerning.ADVISOR,
                        About.GUIDE_WITHDRAW,
                        Status.RECIEVED,
                        Map.of("tour_id", event_id)
                );
            } catch (Exception e) {
                System.out.println("A message should've been sent, buttttt, its ok if it didn't, the advisor should check");
            }

        } else if (fairs.containsKey(event_id)) {
            if (!fairs.get(event_id).getGuides().contains(userID)) {return;}

            if (List.of(FairStatus.FINISHED, FairStatus.CANCELLED, FairStatus.REJECTED, FairStatus.ONGOING).contains(fairs.get(event_id).getFair_status())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can not withdraw from this fair!");
            }

            database.fairs.updateFair(fairs.get(event_id).setGuides(fairs.get(event_id).getGuides().stream().filter(id -> !id.equals(userID)).toList()), event_id);

            // notify coordinator
            database.people.fetchCoordinators(null).forEach(
                    u -> {
                        try {
                            mail.sendMail(
                                    u.getProfile().getContact_info().getEmail(),
                                    Concerning.COORDINATOR,
                                    About.GUIDE_WITHDRAW,
                                    Status.RECIEVED,
                                    Map.of("fair_id", event_id)
                            );
                        } catch (Exception e) {
                            System.out.println("A message should've been sent, buttttt, its ok if it didn't, the coordinator should check");
                        }
                    }
            );
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event not found");
        }
    }

    public void inviteGuidesToEvent(String auth, String event_id, List<String> guides) {
        if (!authService.check(auth, Permission.ASSIGN_OTHER_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to invite guides to events!");
        }

        // check if event exists
        Map<String, TourRegistry> tours = database.tours.fetchTours();
        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();

        if (tours.containsKey(event_id)) {
            for (String guideID : guides) {
                try {
                    inviteGuideToTour(event_id, guideID, JWTService.getSimpleton().decodeUserID(auth));
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("There was an error while trying to invite a guide to a tour!");
                }
            }
        } else if (fairs.containsKey(event_id)) {
            for (String guideID : guides) {
                try {
                    inviteGuideToFair(event_id, guideID, JWTService.getSimpleton().decodeUserID(auth));
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("There was an error while trying to invite a guide to a fair!");
                }
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event not found!");
        }
    }

    private void inviteGuideToTour(String tour_id, String guideID, String inviterID) {
        if (database.people.fetchUser(guideID) == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found!");
        }

        // check if tour exists
        TourRegistry tour = database.tours.fetchTour(tour_id);

        // check if guide exists
        User user = database.people.fetchUser(guideID);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found");
        }

        if (!user.getStatus().equals(UserStatus.ACTIVE)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide is not active!");
        }

        if (tour.getGuides().contains(guideID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide is already assigned to the tour!");
        }

        // create new GuideAssignmentRequest
        GuideAssignmentRequest request = new GuideAssignmentRequest();
        request.setEvent_id(tour_id);
        ContactInfo requestBy = null;
        try {
            requestBy = database.people.fetchUser(inviterID).getProfile().getContact_info();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inviter not found!");
        }
        request.setRequested_by(new Requester().setContactInfo(requestBy).setBilkent_id(inviterID));
        request.setGuide_id(guideID);
        request.setRequested_at(new ZTime(ZonedDateTime.now()));
        request.setStatus(RequestStatus.PENDING);
        request.setType(RequestType.ASSIGNMENT);
        request.setNotes("You have been invited to join this tour");

        // make sure of the id uniqueness, could use ostrich algo here for efficiency
        List<GuideAssignmentRequest> assignmentRequests = database.requests.getGuideAssignmentRequests();
        while (assignmentRequests.stream().anyMatch(r -> r.getRequest_id().equals(request.getRequest_id()))) {
            request.generateID();
        }

        // save the request
        database.requests.addRequest(request);

        mail.sendMail(
                database.people.fetchUser(guideID).getProfile().getContact_info().getEmail(),
                Concerning.GUIDE,
                About.GUIDE_ASSIGNMENT,
                Status.RECIEVED,
                Map.of("event_id", tour_id, "request_id", request.getRequest_id())
        );
    }

    private void inviteGuideToFair(String fair_id, String guideID, String inviterID) {
        if (database.people.fetchUser(guideID) == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found!");
        }
        FairRegistry fair;
        // check if tour exists
        try {
            fair = database.fairs.fetchFairs().get(fair_id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fair not found!");
        }

        // check if guide exists
        User user = database.people.fetchUser(guideID);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found");
        }

        if (!user.getStatus().equals(UserStatus.ACTIVE)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide is not active!");
        }

        if (fair.getGuides().contains(guideID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide is already assigned to the fair!");
        }

        // create new GuideAssignmentRequest
        GuideAssignmentRequest request = new GuideAssignmentRequest();
        request.setEvent_id(fair_id);
        ContactInfo requestBy = null;
        try {
            requestBy = database.people.fetchUser(inviterID).getProfile().getContact_info();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inviter not found!");
        }
        request.setRequested_by(new Requester().setContactInfo(requestBy).setBilkent_id(inviterID));
        request.setGuide_id(guideID);
        request.setRequested_at(new ZTime(ZonedDateTime.now()));
        request.setStatus(RequestStatus.PENDING);
        request.setType(RequestType.ASSIGNMENT);
        request.setNotes("You have been invited to join this tour");

        // make sure of the id uniqueness, could use ostrich algo here for efficiency
        List<GuideAssignmentRequest> assignmentRequests = database.requests.getGuideAssignmentRequests();
        while (assignmentRequests.stream().anyMatch(r -> r.getRequest_id().equals(request.getRequest_id()))) {
            request.generateID();
        }

        // save the request
        database.requests.addRequest(request);

        mail.sendMail(
                database.people.fetchUser(guideID).getProfile().getContact_info().getEmail(),
                Concerning.GUIDE,
                About.GUIDE_ASSIGNMENT,
                Status.RECIEVED,
                Map.of("event_id", fair_id, "request_id", request.getRequest_id())
        );
    }
    public void removeGuides(String auth, String event_id, List<String> guides) {
        if (!authService.check(auth, Permission.ASSIGN_OTHER_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to remove guides from events!");
        }

        // check if event exists
        Map<String, TourRegistry> tours = database.tours.fetchTours();
        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();

        if (tours.containsKey(event_id)) {
            for (String guideID : guides) {
                try {
                    removeGuideFromTour(event_id, guideID, JWTService.getSimpleton().decodeUserID(auth));
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("There was an error while trying to remove a guide from a tour!");
                }
            }
        } else if (fairs.containsKey(event_id)) {
            for (String guideID : guides) {
                try {
                    removeGuideFromFair(event_id, guideID, JWTService.getSimpleton().decodeUserID(auth));
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("There was an error while trying to remove a guide from a fair!");
                }
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event not found!");
        }
    }

    public void removeGuideFromTour(String auth, String tourID, String guideID) {
        if (!authService.check(auth, Permission.RU_FROM_TOUR)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized to perform this action.!");
        }


        // first check if there are unresponded invitations with these guide ids
        List<GuideAssignmentRequest> assignmentRequests = database.requests.getGuideAssignmentRequests();

        assignmentRequests = assignmentRequests.stream().filter(
                inv -> inv.getEvent_id().matches(tourID)
        ).filter(
                inv -> inv.getGuide_id().equals(guideID)
        ).filter(
                inv -> inv.getStatus().equals(RequestStatus.PENDING)
        ).toList();

        for (GuideAssignmentRequest request : assignmentRequests) {
            requestService.respondToRequest(
                    auth,
                    request.getRequest_id(),
                    RequestStatus.REJECTED.toString()
            );
            request.setStatus(RequestStatus.REJECTED);
            database.requests.updateRequest(request);
        }


        // get tours
        Map<String, TourRegistry> tours = database.tours.fetchTours();

        // check if tour actually exists
        if (!tours.containsKey(tourID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }

        if (!tours.get(tourID).getGuides().contains(guideID)) {
            return;
        }

        TourRegistry tour = tours.get(tourID);

        // remove user from tour
        tour.setGuides(tour.getGuides().stream().filter(id -> !id.equals(guideID)).toList());

        // save tour
        database.tours.updateTour(tour, tourID);

        try {
            mail.sendMail(
                    database.people.fetchGuides(guideID).get(0).getProfile().getContact_info().getEmail(),
                    Concerning.GUIDE,
                    About.GUIDE_ASSIGNMENT,
                    Status.CANCELLED,
                    Map.of("event_id", tourID)
            );
        } catch (Exception e) {
            System.out.println("There was an error while trying to send an email! Probably couldn't find the guide" + guideID);
        }
    }

    public void removeGuideFromFair(String auth, String fairID, String guideID) {
        if (!authService.check(auth, Permission.RU_FROM_TOUR)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized to perform this action.!");
        }

        // first check if there are unresponded invitations with these guide ids
        List<GuideAssignmentRequest> assignmentRequests = database.requests.getGuideAssignmentRequests();

        assignmentRequests = assignmentRequests.stream().filter(
                inv -> inv.getEvent_id().matches(fairID)
        ).filter(
                inv -> inv.getGuide_id().equals(guideID)
        ).filter(
                inv -> inv.getStatus().equals(RequestStatus.PENDING)
        ).toList();

        for (GuideAssignmentRequest request : assignmentRequests) {
            requestService.respondToRequest(
                    auth,
                    request.getRequest_id(),
                    RequestStatus.REJECTED.toString()
            );
            request.setStatus(RequestStatus.REJECTED);
            database.requests.updateRequest(request);
        }


        // get fairs
        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();

        // check if fair actually exists
        if (!fairs.containsKey(fairID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }

        if (!fairs.get(fairID).getGuides().contains(guideID)) {
            return;
        }

        FairRegistry fair = fairs.get(fairID);

        // remove user from fair
        fair.setGuides(fair.getGuides().stream().filter(id -> !id.equals(guideID)).toList());

        // save tour
        database.fairs.updateFair(fair, fairID);

        try {
            mail.sendMail(
                    database.people.fetchGuides(guideID).get(0).getProfile().getContact_info().getEmail(),
                    Concerning.GUIDE,
                    About.GUIDE_ASSIGNMENT,
                    Status.CANCELLED,
                    Map.of("event_id", fairID)
            );
        } catch (Exception e) {
            System.out.println("There was an error while trying to send an email! Probably couldn't find the guide" + guideID);
        }

    }

}
