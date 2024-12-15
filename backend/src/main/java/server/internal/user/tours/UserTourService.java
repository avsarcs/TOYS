package server.internal.user.tours;

import server.apply.RequestService;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.ExperienceLevel;
import server.enums.status.RequestStatus;
import server.enums.types.RequestType;
import server.enums.status.TourStatus;
import server.enums.types.TourType;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTO_GroupTour;
import server.models.DTO.DTO_IndividualTour;
import server.models.people.details.ContactInfo;
import server.models.time.ZTime;
import server.models.people.GuideAssignmentRequest;
import server.models.events.TourRegistry;
import server.models.people.Guide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class UserTourService {
    @Autowired
    Database databaseEngine;

    @Autowired
    MailServiceGateway mailServiceGateway;

    @Autowired
    RequestService requestService;

    public boolean enrollGuideInTour(String guideID, String tourID) {
        // get tours
        Map<String, TourRegistry> tours = databaseEngine.tours.fetchTours();

        // check if tour actually exists
        if (!tours.containsKey(tourID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if user is already assigned to the tour
        for (String guideIDe : tours.get(tourID).getGuides()) {
            if (guideIDe.equals(guideID)) {
                return true; // the user is already assigned to this tour, but its alright
            }
        }
        TourRegistry tour = tours.get(tourID);

        // assign user to tour
        tour.getGuides().add(guideID);

        // save tour
        databaseEngine.tours.updateTour(tour, tourID);

        String email = "";
        try {
            email = databaseEngine.people.fetchAdvisorForDay(tour.getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail();
            mailServiceGateway.sendMail(
                    email,
                    Concerning.ADVISOR,
                    About.GUIDE_ASSIGNMENT,
                    Status.RECIEVED,
                    Map.of("tour_id", tourID)
            );
        } catch (Exception e) {
            System.out.println("There was an error while trying to send an email! Probably couldn't find an advisor for the day");
        }

        // update the guide's previous tours as well
        Guide guide = databaseEngine.people.fetchGuides(guideID).get(0);
        guide.getExperience().getPrevious_events().add(tourID);
        databaseEngine.people.updateUser(guide);
        return true;
    }

    public List<Object> getTours(String authToken) {
        if (!JWTService.testToken.equals(authToken)) {
            // validate token
            if(!JWTService.getSimpleton().isValid(authToken)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }

            // check permissions
            if (!PermissionMap.hasPermission(
                    JWTService.getSimpleton().getUserRole(authToken),
                    Permission.VIEW_TOUR_INFO)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
        }
        // extract user id from token
        String userId = JWTService.getSimpleton().decodeUserID(authToken);
        // get tours from database
        List<Object> tours = databaseEngine.tours
                .fetchTours()
                .values()
                .stream()
                .collect(ArrayList::new,
                        (list, value) -> {
                            if(value.getTour_type() == TourType.GROUP) {
                                list.add(DTO_GroupTour.fromTourRegistry(value));
                            }
                            else if (value.getTour_type() == TourType.INDIVIDUAL) {
                                list.add(DTO_IndividualTour.fromTourRegistry(value));
                            }
                        },
                        ArrayList::addAll);
        // return tours
        return tours;
    }

    public void withdrawFromTour(String authToken, String tour_id) {
        if (!JWTService.testToken.equals(authToken)) {
            // validate token
            if(!JWTService.getSimpleton().isValid(authToken)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
            // check permissions
            if (!PermissionMap.hasPermission(
                    JWTService.getSimpleton().getUserRole(authToken),
                    Permission.RU_FROM_TOUR)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
        }

        String userID = JWTService.getSimpleton().decodeUserID(authToken);

        // get user
        Guide user;
        try {
            user = databaseEngine.people.fetchGuides(userID).get(0);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You don't exist, thus you don't think");
        }

        // get tours
        Map<String, TourRegistry> tours = databaseEngine.tours.fetchTours();

        // check if tour actually exists
        if (!tours.containsKey(tour_id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }

        boolean found = false;
        // check if user is already assigned to the tour
        for (String guide_id : tours.get(tour_id).getGuides()) {
            if (guide_id.equals(userID)) {
                found = true;
                break;
            }
        }
        if (!found) {
            // guide is (already) not assigned to the tour, hence just assume the request is successful
            return;
        }

        // remove user from tour
        tours.get(tour_id).getGuides().removeIf(guideID -> guideID.equals(userID));

        // save tour
        databaseEngine.tours.updateTour(tours.get(tour_id), tour_id);

        try {
            // send advisor a notification for the withdrawal
            mailServiceGateway.sendMail(
                    databaseEngine.people.fetchAdvisorForDay(tours.get(tour_id).getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                    Concerning.ADVISOR,
                    About.GUIDE_WITHDRAW,
                    Status.RECIEVED,
                    Map.of("tour_id", tour_id)
            );
        } catch (Exception e) {
            System.out.println("A message should've been sent, buttttt, its ok if it didn't, the advisor should check");
        }

    }

    public void updateTourStatus(String authToken, String tour_id, String statusString) {
        if (!JWTService.testToken.equals(authToken)) {
            // validate token
            if (!JWTService.getSimpleton().isValid(authToken)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
            // validate permission
            if (!PermissionMap.hasPermission(
                    JWTService.getSimpleton().getUserRole(authToken),
                    Permission.REPORT_TOUR_TIMES)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
        }
        // fetch tour
        TourRegistry tour = databaseEngine.tours.fetchTour(tour_id);
        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if already assigned to tour
        boolean guideAssigned = false;
        String userID = JWTService.getSimpleton().decodeUserID(authToken);
        for (String guideID : tour.getGuides()) {
            if (guideID.equals(userID)) {
                guideAssigned = true;
                break;
            }
        }
        if (!guideAssigned) {
            return; // The guide is not assigned to this tour, why are you trying to do this?, but ok
        }
        // check the status
        // update status
        TourStatus status = TourStatus.valueOf(statusString);
        if (status == TourStatus.ONGOING && tour.getTourStatus() == TourStatus.CONFIRMED) {
            // ok so this is start of the tour, then we need to log the work hours
            tour.setStarted_at(new ZTime(ZonedDateTime.now()));
            tour.setTour_status(TourStatus.ONGOING);
        } else if (status == TourStatus.FINISHED && tour.getTourStatus() == TourStatus.ONGOING) {
            // ok so this is end of the tour, then we need to log end
            tour.setEnded_at(new ZTime(ZonedDateTime.now()));
            tour.setTour_status(TourStatus.FINISHED);
            // TODO: LOG WORK HOURS FOR GUIDES MODELS ALSO
        } else if (status == TourStatus.CANCELLED) {
            // ok so this is end of the tour, then we need to log end
            tour.setTour_status(TourStatus.CANCELLED);
        } else {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid status change");
        }
        // save tour to database
        databaseEngine.tours.updateTour(tour, tour_id);

        // update the previous tours of the guide
        Guide guide = databaseEngine.people.fetchGuides(userID).get(0);
        guide.getExperience().setPrevious_events(guide.getExperience().getPrevious_events().stream().filter(t -> !t.equals(tour_id)).toList());
        databaseEngine.people.updateUser(guide);
    }

    public void enrollInTour(String authToken, String tid) {
        String userID;
        if (!JWTService.testToken.equals(authToken)) {

            // check token validity
            if (!JWTService.getSimpleton().isValid(authToken)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
            // check permission
            if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.RU_FROM_TOUR)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
            userID = JWTService.getSimpleton().decodeUserID(authToken);
        } else {
            userID  = Guide.getDefault().getBilkent_id();
        }
        // get user
        Guide user;
        try {
            user = databaseEngine.people.fetchGuides(userID).get(0);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You don't exist, thus you don't think");
        }
        // check for the special case, if the guide is a noob
        if (user.getExperience().getExperienceLevel_level() == ExperienceLevel.TRAINEE) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Noobs can't enroll in tours, git gud");
        }

        // get tours
        Map<String, TourRegistry> tours = databaseEngine.tours.fetchTours();

        for (String kety : tours.keySet()) {
            System.out.println(kety);
        }
        System.out.println("TID: " + tid);

        // check if tour actually exists
        if (!tours.containsKey(tid)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if user is already assigned to the tour
        for (String guideID : tours.get(tid).getGuides()) {
            if (guideID.equals(userID)) {
                return; // the user is already assigned to this tour, but its alright
            }
        }
        // check if tid tour time conflicts with user's other tours
        for (TourRegistry tour : tours.values()) {
            if (tour.getTour_id().equals(tid)) {
                continue;
            }
            // good luck debugging this
            if (tour.getGuides().stream().anyMatch(guide -> guide.equals(userID))) {
                try {
                    if (!(tour.getAccepted_time().getDate().isBefore(tours.get(tid).getAccepted_time().getDate().minus(Duration.ofMinutes(30))) ||
                            tour.getAccepted_time().getDate().isAfter(tours.get(tid).getAccepted_time().getDate().plus(Duration.ofMinutes(30))))) {
                        throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You have a tour at this time");
                    }
                } catch (NullPointerException e) {
                    // ignore
                }
            }
        }
        enrollGuideInTour(userID, tid);
    }



    public void inviteToTour(String authToken, String tourID, String guideID) {
        if (!JWTService.testToken.equals(authToken)) {
            // validate token
            if (!JWTService.getSimpleton().isValid(authToken)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
            // check permission
            if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.ASSIGN_OTHER_GUIDE)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
        }
        String userID = JWTService.getSimpleton().decodeUserID(authToken);
        // check if tour exists
        TourRegistry tour = databaseEngine.tours.fetchTour(tourID);
        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if guide exists
        Guide guide = databaseEngine.people.fetchGuides(guideID).get(0);
        if (guide == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found");
        }
        // check if guide is already assigned to the tour
        for (String assignedGuideID : tour.getGuides()) {
            if (assignedGuideID.equals(guideID)) {
                // Although this is technically an error, the response is semantically correct
                throw new ResponseStatusException(HttpStatus.OK, "Guide is already assigned to the tour");
            }
        }
        // create new GuideAssignmentRequest
        GuideAssignmentRequest request = new GuideAssignmentRequest();
        request.setEvent_id(tourID);
        ContactInfo requestBy = null;
        try {
            requestBy = databaseEngine.people.fetchAdvisors(userID).get(0).getProfile().getContact_info();
        } catch (Exception e) {
            System.out.println("Although this guide requested something, they do not exist. This is not possible, and can only happen in a testing scenario.");
            requestBy = ContactInfo.getDefault();
        }
        request.setRequested_by(requestBy);
        request.setRequested_guide_id(guideID);
        request.setRequested_at(new ZTime(ZonedDateTime.now()));
        request.setStatus(RequestStatus.PENDING);
        request.setType(RequestType.ASSIGNMENT);
        request.setNotes("You have been invited to join this tour");

        // make sure of the id uniqueness, could use ostrich algo here for efficiency
        while (!databaseEngine.requests.getRequests(request.getRequest_id()).isEmpty()) {
            request.generateID();
        }
        // save the request
        databaseEngine.requests.addRequest(request);

        mailServiceGateway.sendMail(
                databaseEngine.people.fetchGuides(guideID).get(0).getProfile().getContact_info().getEmail(),
                Concerning.GUIDE,
                About.GUIDE_ASSIGNMENT,
                Status.RECIEVED,
                Map.of("tour_id", tourID, "request_id", request.getRequest_id())
        );
    }

    public void respondToTourInvite(String authToken, String idt, String responseString) {
        if (!JWTService.testToken.equals(authToken)) {
            // validate token
            if (!JWTService.getSimpleton().isValid(authToken)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
            // check permission
            if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.ASSIGN_OTHER_GUIDE)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
        }

        // check response
        RequestStatus response = RequestStatus.valueOf(responseString);
        // fetch request
        GuideAssignmentRequest request = databaseEngine
                .requests
                .getRequestsOfType(
                        RequestType.ASSIGNMENT,
                        idt
                ).stream()
                .filter(
                        r -> r instanceof GuideAssignmentRequest
                ).map(
                        r -> (GuideAssignmentRequest) r
                ).toList()
                .get(0);

        // check if the response is valid
        if (response == RequestStatus.APPROVED) {
            //String guideID = JWTService.getSimpleton().decodeUserID(authToken);
            String tourID = request.getEvent_id();
            enrollInTour(authToken, tourID);
            requestService.respondToRequest(authToken, idt, responseString);
        }


        mailServiceGateway.sendMail(
                databaseEngine.people.fetchGuides(request.getRequested_guide_id()).get(0).getProfile().getContact_info().getEmail(),
                Concerning.ADVISOR,
                About.GUIDE_ASSIGNMENT,
                Status.APPROVAL,
                Map.of("tour_id", request.getEvent_id(), "response", responseString)
        );
    }
}
