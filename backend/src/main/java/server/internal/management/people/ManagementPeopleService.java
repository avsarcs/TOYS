package server.internal.management.people;

import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.status.*;
import server.enums.types.ApplicationType;
import server.enums.types.RequestType;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.*;
import server.models.events.FairRegistry;
import server.models.events.TourRegistry;
import server.models.people.GuideApplication;
import server.models.people.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.models.people.details.ContactInfo;
import server.models.requests.GuideAssignmentRequest;
import server.models.requests.Requester;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ManagementPeopleService {
    @Autowired
    Database databaseEngine;

    @Autowired
    MailServiceGateway mailService;

    @Autowired
    AuthService authService;

    public void inviteUserToFair(String auth, String invitee, String fairId) {

        if (!authService.check(auth, Permission.INVITE_GUIDE_TO_FAIR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to invite users to fairs!");
        }


        //check if fair exists
        if (databaseEngine.fairs
                .fetchFairs()
                .keySet().stream().noneMatch(k -> k.equals(fairId))) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Fair does not exist!");
        }

        //check if guide exists
        if (databaseEngine.people.fetchUser(invitee) == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Guide does not exist!");
        }

        GuideAssignmentRequest request = new GuideAssignmentRequest();

        request.setEvent_id(fairId);
        request.setGuide_id(invitee);
        request.setRequested_at(new ZTime(ZonedDateTime.now()));
        request.setStatus(RequestStatus.PENDING);
        request.setType(RequestType.ASSIGNMENT);
        request.setNotes("");

        String userID = JWTService.getSimpleton().decodeUserID(auth);

        // fetch the source contact info
        ContactInfo contact = databaseEngine.people.fetchUser(userID).getProfile().getContact_info();

        request.setRequested_by(new Requester().setBilkent_id(userID).setContactInfo(contact));

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

        if (!authService.check(auth, Permission.FIRE_GUIDE_OR_ADVISOR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to fire users!");
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
                if (tour.getValue().getTourStatus() == TourStatus.CONFIRMED) {
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
                if (fair.getValue().getFair_status() == FairStatus.CONFIRMED) {
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
        if (!authService.check(authToken, Permission.AR_GUIDE_APPLICATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view applications");
        }

        // get and return all applications
        return databaseEngine.applications.getApplications();
    }

    public List<User> getPeople(String auth) {
        if (!authService.check(auth, Permission.VIEW_WORK_DONE_BY_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view applications");
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
        if (!authService.check(authToken, Permission.AR_GUIDE_APPLICATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view applications");
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
