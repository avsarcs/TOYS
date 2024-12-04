package server.internal.management.people;

import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.*;
import server.enums.status.FAIR_STATUS;
import server.enums.status.TOUR_STATUS;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.*;
import server.models.people.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.models.people.details.AuthInfo;
import server.models.people.details.ContactInfo;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ManagementPeopleService {
    @Autowired
    Database databaseEngine;

    @Autowired
    MailServiceGateway mailService;

    public void inviteUserToFair(String authToken, String invitee, String fairId) {
        // validate jwt token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        // validate permission
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.INVITE_GUIDE_TO_FAIR)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to invite users to fairs!");
        }

        //check if fair exists
        if (databaseEngine.fairs
                .fetchFairs()
                .keySet()
                .stream()
                .filter(
                        k -> k.equals(fairId)
                ).toList()
                .size() == 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Fair does not exist!");
        }

        //check if guide exists
        if (databaseEngine.people.fetchUser(invitee) == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Guide does not exist!");
        }

        GuideAssignmentRequest request = new GuideAssignmentRequest();

        request.setEvent_id(fairId);
        request.setRequested_guide_id(invitee);
        request.setRequested_at(new ZTime(ZonedDateTime.now()));
        request.setStatus(RequestStatus.PENDING);
        request.setType(RequestType.ASSIGNMENT);
        request.setNotes("");

        // fetch the source contact info
        ContactInfo contact = databaseEngine.people.fetchUser(JWTService.getSimpleton().decodeUserID(authToken)).getProfile().getContact_info();

        request.setRequested_by(contact);

        // add the invitation request
        databaseEngine.requests.addRequest(request);

        // notify the guide
        try {
        mailService.sendMail(
                databaseEngine.people.fetchUser(invitee).getProfile().getContact_info().getEmail(),
                Concerning.GUIDE,
                About.GUIDE_ASSIGNMENT,
                Status.RECIEVED,
                Map.of(
                        "event_id", fairId,
                        "event_name", databaseEngine.fairs.fetchFairs().get(fairId).getFair_name(),
                        "request_id", request.getRequest_id()
                )

        );

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void fireUser(String auth, String firee) {
        // validate jwt token
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        // validate permission
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), Permission.FIRE_GUIDE_OR_ADVISOR)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to invite users to fairs!");
        }

        // check if user exists
        if (databaseEngine.people.fetchUser(firee) == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User does not exist!");
        }

        // find all events the user is assigned to, and remove them from those events
        Map<String, TourRegistry> tours = databaseEngine.tours.fetchTours();
        for (Map.Entry<String, TourRegistry> tour : tours.entrySet()) {
            // check if guide is assigned to said tour
            if (tour.getValue().getGuides().contains(firee)) {
                // check if guide is assigned to be a guide for a tour
                if (tour.getValue().getTourStatus() == TOUR_STATUS.CONFIRMED) {
                    tour.getValue().getGuides().remove(firee);
                    databaseEngine.tours.updateTour(tour.getValue(), tour.getKey());
                }
            }
        }

        // find all assigned fairs, remove the guide from them as well
        Map<String, FairRegistry> fairs = databaseEngine.fairs.fetchFairs();
        for (Map.Entry<String, FairRegistry> fair : fairs.entrySet()) {
            // check if guide is assigned to said fair
            if (fair.getValue().getGuides().contains(firee)) {
                if (fair.getValue().getFair_status() == FAIR_STATUS.ACCEPTED) {
                    fair.getValue().getGuides().remove(firee);
                    databaseEngine.fairs.updateFair(fair.getValue(), fair.getKey());
                }
            }
        }

        // set guide status to be inactive
        User user = databaseEngine.people.fetchUser(firee);
        user.setStatus(UserStatus.INACTIVE);
    }

    public Map<String, Application> getApplications(String authToken) {
        // validate jwt token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        // validate permission
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.AR_GUIDE_APPLICATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view or respond to applications!");
        }

        // get and return all applications
        return databaseEngine.applications.getApplications();
    }

    public List<User> getPeople(String authToken) {

        // validate jwt token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        // validate permission
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.VIEW_WORK_DONE_BY_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view people");
        }

        // get all users
        List<User> users = databaseEngine.people.fetchUsers();
        // remove their authentication information
        users.forEach(user -> {
            user.setAuthInfo(null);
        });
        return users;
    }

    public void respondToApplication( String authToken, String applicationId, String response) {
        // validate token and permission
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }
        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.AR_GUIDE_APPLICATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view or respond to applications!");
        }

        ApplicationType type = databaseEngine.applications.getApplications().get(applicationId).getType();

        ApplicationStatus status = ApplicationStatus.valueOf(response);
        databaseEngine.applications.updateApplication(applicationId, type ,status);

        // notify the applicant
        try {
            Application application = databaseEngine.applications.getApplications().get(applicationId);
            if (application.getType() == ApplicationType.GUIDE) {
                mailService.sendMail(
                        databaseEngine.people.fetchUser(((GuideApplication) application).getProfile().getContact_info().getEmail()).getProfile().getContact_info().getEmail(),
                        Concerning.GUIDE,
                        About.GUIDE_APPLICATION,
                        response.equals("ACCEPTED") ? Status.APPROVAL : Status.REJECTION,
                        Map.of(
                                "application_id", applicationId
                        )
                );
            }
        } catch (Exception e) {
            System.out.println("Failed to send email to applicant");
        }
    }
}
