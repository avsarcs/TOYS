package internal.user.tours;

import apply.tour.request_changes.GuideAssignmentRequestModel;
import apply.tour.request_changes.RequestStatus;
import auth.Permission;
import auth.PermissionMap;
import auth.services.JWTService;
import dbm.dbe;
import enums.status.TOUR_STATUS;
import mailService.MailServiceGateway;
import mailService.MailType;
import models.AdvisorModel;
import models.DateWrapper;
import models.data.guides.GUIDE_EXPERIENCE_LEVEL;
import models.data.guides.GuideModel;
import models.data.tours.TourModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import respond.tours.AcceptDeny;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalUnit;
import java.util.List;
import java.util.Map;

@Service
public class TourService {
    @Autowired
    dbe databaseEngine;

    @Autowired
    MailServiceGateway mailServiceGateway;


    public List<TourModel> getTours(String authToken) {
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
        // extract user id from token
        String userId = JWTService.getSimpleton().decodeUserID(authToken);
        // get tours from database
        List<TourModel> tours = databaseEngine.fetchTours().values().stream().toList();
        // return tours
        return tours;
    }

    public void withdrawFromTour(String authToken, String tid) {
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

        String userID = JWTService.getSimpleton().decodeUserID(authToken);

        // get user
        GuideModel user = databaseEngine.fetchGuide(userID);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You don't exist, thus you don't think");
        }

        // get tours
        Map<String, TourModel> tours = databaseEngine.fetchTours();

        // check if tour actually exists
        if (!tours.containsKey(tid)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }

        boolean found = false;
        // check if user is already assigned to the tour
        for (GuideModel guide : tours.get(tid).getAssigned_guides()) {
            if (guide.getBilkentID().equals(userID)) {
                found = true;
                break;
            }
        }
        if (!found) {
            // guide is (already) not assigned to the tour, hence just assume the request is successful
            return;
        }

        // remove user from tour
        tours.get(tid).getAssigned_guides().removeIf(guide -> guide.getBilkentID().equals(userID));

        // save tour
        databaseEngine.updateTour(tours.get(tid), tid);

        for (TourModel tour : databaseEngine.fetchTours().values()) {
            if (tour.getId().equals(tid)) {
                AdvisorModel advisor = databaseEngine.fetchAdvisorForDay(tour.getAccepted_date().getDayOfWeek());
                String advisorEmail = databaseEngine.fetchProfile(advisor.getBilkentID()).getContactDetails().getEmail();
                mailServiceGateway.sendMail(advisorEmail, MailType.GUIDE_WITHDRAW_FROM_TOUR, Map.of("tour_id", tid));
                break;
            }
        }
    }

    public void updateTourStatus(String authToken, String tid, String statusString) {
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
        // fetch tour
        TourModel tour = databaseEngine.fetchTour(tid);
        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if already assigned to tour
        boolean guideAssigned = false;
        for (GuideModel guide : tour.getAssigned_guides()) {
            if (guide.getBilkentID().equals(JWTService.getSimpleton().decodeUserID(authToken))) {
                guideAssigned = true;
                break;
            }
        }
        if (!guideAssigned) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "The guide is not assigned to this tour, why are you trying to do this?");
        }
        // check the status
        // update status
        TOUR_STATUS status = TOUR_STATUS.valueOf(statusString);
        if (status == TOUR_STATUS.ONGOING && tour.getStatus() == TOUR_STATUS.CONFIRMED) {
            // ok so this is start of the tour, then we need to log the work hours
            tour.setStarted_at(new DateWrapper(ZonedDateTime.now()));
            tour.setStatus(TOUR_STATUS.ONGOING);
        } else if (status == TOUR_STATUS.FINISHED && tour.getStatus() == TOUR_STATUS.ONGOING) {
            // ok so this is end of the tour, then we need to log end
            tour.setEnded_at(new DateWrapper(ZonedDateTime.now()));
            tour.setStatus(TOUR_STATUS.FINISHED);
            // TODO: LOG WORK HOURS FOR GUIDES MODELS ALSO
        } else if (status == TOUR_STATUS.CANCELLED) {
            // ok so this is end of the tour, then we need to log end
            tour.setStatus(TOUR_STATUS.CANCELLED);
        } else {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid status change");
        }
        // save tour to database
        databaseEngine.updateTour(tour, tid);
    }

    public void enrollInTour(String authToken, String tid) {
        // check token validity
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // check permission
        String userID = JWTService.getSimpleton().decodeUserID(authToken);
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.RU_FROM_TOUR)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // get user
        GuideModel user = databaseEngine.fetchGuide(userID);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You don't exist, thus you don't think");
        }
        // check for the special case, if the guide is a noob
        if (user.getExperience_level() == GUIDE_EXPERIENCE_LEVEL.TRAINEE) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Noobs can't enroll in tours, git gud");
        }

        // get tours
        Map<String, TourModel> tours = databaseEngine.fetchTours();

        // check if tour actually exists
        if (!tours.containsKey(tid)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if user is already assigned to the tour
        for (GuideModel guide : tours.get(tid).getAssigned_guides()) {
            if (guide.getBilkentID().equals(userID)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You are already assigned to this tour");
            }
        }
        // check if tid tour time conflicts with user's other tours
        for (TourModel tour : tours.values()) {
            if (tour.getId().equals(tid)) {
                continue;
            }
            // good luck debugging this
            if (tour.getAssigned_guides().stream().anyMatch(guide -> guide.getBilkentID().equals(userID))) {
                try {
                    if (!(tour.getAccepted_date().isBefore(tours.get(tid).getAccepted_date().minus(Duration.ofMinutes(30))) ||
                            tour.getAccepted_date().isAfter(tours.get(tid).getAccepted_date().plus(Duration.ofMinutes(30))))) {
                        throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You have a tour at this time");
                    }
                } catch (NullPointerException e) {
                    // ignore
                }
            }
        }
        // assign user to tour
        tours.get(tid).getAssigned_guides().add(user);

        // save tour
        databaseEngine.updateTour(tours.get(tid), tid);

        for (TourModel tour : databaseEngine.fetchTours().values()) {
            if (tour.getId().equals(tid)) {
                AdvisorModel advisor = databaseEngine.fetchAdvisorForDay(tour.getAccepted_date().getDayOfWeek());
                String advisorEmail = databaseEngine.fetchProfile(advisor.getBilkentID()).getContactDetails().getEmail();
                mailServiceGateway.sendMail(advisorEmail, MailType.GUIDE_TOUR_ENROLL_NOTIFICATION, Map.of("tour_id", tid, "guide_id", userID));
                break;
            }
        }
    }



    public void inviteToTour(String authToken, String tourID, String guideID) {
        // validate token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // check permission
        String userID = JWTService.getSimpleton().decodeUserID(authToken);
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.ASSIGN_OTHER_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // check if tour exists
        TourModel tour = databaseEngine.fetchTour(tourID);
        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
        }
        // check if guide exists
        GuideModel guide = databaseEngine.fetchGuide(guideID);
        if (guide == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found");
        }
        // check if guide is already assigned to the tour
        for (GuideModel assignedGuide : tour.getAssigned_guides()) {
            if (assignedGuide.getBilkentID().equals(guideID)) {
                // Although this is technically an error, the response is semantically correct
                throw new ResponseStatusException(HttpStatus.OK, "Guide is already assigned to the tour");
            }
        }
        // create new GuideAssignmentRequest
        GuideAssignmentRequestModel request = (GuideAssignmentRequestModel) new GuideAssignmentRequestModel()
                .setTour_id(tourID)
                .setAdvisor_id(userID)
                .setGuide_id(guideID)
                .setRequested_at(new DateWrapper(ZonedDateTime.now()));
        request.setStatus(RequestStatus.PENDING);
        request.generateId();

        // make sure of the id uniqueness, could use ostrich algo here for efficiency
        while (databaseEngine.fetchRequest(request.getId()) != null) {
            request.generateId();
        }
        // save the request
        databaseEngine.addRequest(request);

        mailServiceGateway.sendMail(databaseEngine.fetchProfile(guideID).getContactDetails().getEmail(), MailType.GUIDE_TOUR_ASSIGNMENT, Map.of("tour_id", tourID, "request_id", request.getId()));
    }

    public void respondToTourInvite(String authToken, String idt, String responseString) {
        // validate token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // check permission
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.ASSIGN_OTHER_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // check response
        AcceptDeny response = AcceptDeny.valueOf(responseString);
        // fetch request
        GuideAssignmentRequestModel request = (GuideAssignmentRequestModel) databaseEngine.fetchRequest(idt);
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request not found");
        }
        // check if the request is already responded
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already responded");
        }
        // check if the response is valid
        if (response == AcceptDeny.ACCEPT) {
            // assign the guide to the tour
            TourModel tour = databaseEngine.fetchTour(request.getTour_id());
            if (tour == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found");
            }
            GuideModel guide = databaseEngine.fetchGuide(request.getGuide_id());
            if (guide == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found");
            }
            tour.getAssigned_guides().add(guide);
            databaseEngine.updateTour(tour, request.getTour_id());
        }
        // update the request
        request.accept_reject(response);
        databaseEngine.updateRequest(request);

        for (TourModel tour : databaseEngine.fetchTours().values()) {
            if (tour.getId().equals(request.getTour_id())) {
                AdvisorModel advisor = databaseEngine.fetchAdvisorForDay(tour.getAccepted_date().getDayOfWeek());
                String advisorEmail = databaseEngine.fetchProfile(advisor.getBilkentID()).getContactDetails().getEmail();
                mailServiceGateway.sendMail(advisorEmail, MailType.GUIDE_TOUR_ASSIGNMENT_ACCEPTION, Map.of("tour_id", request.getTour_id()));
                break;
            }
        }
    }
}
