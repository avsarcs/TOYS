package server.internal.management.people;

import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.roles.UserRole;
import server.enums.status.*;
import server.enums.types.ApplicationType;
import server.enums.types.RequestType;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.*;
import server.models.DTO.DTOFactory;
import server.models.events.FairRegistry;
import server.models.events.TourRegistry;
import server.models.people.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.models.people.details.ContactInfo;
import server.models.requests.AdvisorPromotionRequest;
import server.models.requests.GuideAssignmentRequest;
import server.models.requests.Requester;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ManagementPeopleService {
    @Autowired
    Database database;

    @Autowired
    MailServiceGateway mailService;

    @Autowired
    AuthService authService;

    @Autowired
    DTOFactory dto;


    public void promoteUser(String auth, String invitee) {
        if (!authService.check(auth, Permission.FIRE_GUIDE_OR_ADVISOR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to promote users!");
        }

        User user = database.people.fetchUser(invitee);

        // check if user exists
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "User does not exist!");
        }


        if (List.of(UserRole.GUIDE, UserRole.ADVISOR).contains(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "U r a maggot with no permission to do this!");
        }

        try {
            Guide guide = database.people.fetchGuides(invitee).get(0);
            database.people.deleteUser(invitee, UserRole.GUIDE);

            Advisor advisor = new Advisor(guide);

            database.people.addUser(advisor);

            try{

                mailService.sendMail(
                        advisor.getProfile().getContact_info().getEmail(),
                        Concerning.GUIDE,
                        About.ADVISOR_APPLICATION,
                        Status.APPROVAL,
                        Map.of()
                );
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already an advisor or above!");
        }

        if (true == (1 == 1)) {
            return;
        }



        AdvisorPromotionRequest APR = new AdvisorPromotionRequest();
        APR.setGuide_id(invitee);
        APR.setStatus(RequestStatus.PENDING);
        APR.setRequested_at(new ZTime(ZonedDateTime.now()));
        APR.setRequest_id("APR" + System.currentTimeMillis() + UUID.randomUUID());

        APR.setType(RequestType.PROMOTION);
        Requester requester = new Requester();
        requester.setBilkent_id(JWTService.getSimpleton().decodeUserID(auth));
        requester.setContactInfo(database.people.fetchUser(requester.getBilkent_id()).getProfile().getContact_info());
        APR.setRequested_by(requester);

        database.requests.addRequest(APR);

        // notify the guide
        try {
            mailService.sendMail(
                    database.people.fetchUser(invitee).getProfile().getContact_info().getEmail(),
                    Concerning.GUIDE,
                    About.ADVISOR_APPLICATION,
                    Status.RECIEVED,
                    Map.of(
                            "request_id", APR.getRequest_id()
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void inviteUserToFair(String auth, String invitee, String fairId) {

        if (!authService.check(auth, Permission.INVITE_GUIDE_TO_FAIR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to invite users to fairs!");
        }


        //check if fair exists
        if (database.fairs
                .fetchFairs()
                .keySet().stream().noneMatch(k -> k.equals(fairId))) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Fair does not exist!");
        }

        //check if guide exists
        if (database.people.fetchUser(invitee) == null) {
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
        ContactInfo contact = database.people.fetchUser(userID).getProfile().getContact_info();

        request.setRequested_by(new Requester().setBilkent_id(userID).setContactInfo(contact));

        // add the invitation request
        database.requests.addRequest(request);

        // notify the guide
        try {
        mailService.sendMail(
                database.people.fetchUser(invitee).getProfile().getContact_info().getEmail(),
                Concerning.GUIDE,
                About.GUIDE_ASSIGNMENT,
                Status.RECIEVED,
                Map.of(
                        "event_id", fairId,
                        "event_name", database.fairs.fetchFairs().get(fairId).getFair_name(),
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
        if (database.people.fetchUser(firee) == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User does not exist!");
        }

        // find all events the user is assigned to, and remove them from those events
        Map<String, TourRegistry> tours = database.tours.fetchTours();
        for (Map.Entry<String, TourRegistry> tour : tours.entrySet()) {
            // check if guide is assigned to said tour
            if (tour.getValue().getGuides().contains(firee)) {
                // check if guide is assigned to be a guide for a tour
                if (tour.getValue().getTourStatus() == TourStatus.CONFIRMED) {
                    tour.getValue().getGuides().remove(firee);
                    database.tours.updateTour(tour.getValue(), tour.getKey());
                }
            }
        }

        // find all assigned fairs, remove the guide from them as well
        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();
        for (Map.Entry<String, FairRegistry> fair : fairs.entrySet()) {
            // check if guide is assigned to said fair
            if (fair.getValue().getGuides().contains(firee)) {
                if (fair.getValue().getFair_status() == FairStatus.CONFIRMED) {
                    fair.getValue().getGuides().remove(firee);
                    database.fairs.updateFair(fair.getValue(), fair.getKey());
                }
            }
        }

        // set guide status to be inactive
        User user = database.people.fetchUser(firee);
        user.setStatus(UserStatus.INACTIVE);
    }

    public List<Map<String, Object>> getApplications(String auth) {
        if (!authService.check(auth, Permission.AR_GUIDE_APPLICATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view applications");
        }

        List<Map<String, Object>> applications = new ArrayList<>();

        database.applications.getGuideApplications().entrySet().stream().filter(
                entry -> entry.getValue().getStatus().equals(ApplicationStatus.RECEIVED)
        ).forEach(
                e -> {
                    applications.add(dto.guideApplication(e.getValue()));
                }
        );

        // get and return all applications
        return applications;
    }

    public List<User> getPeople(String auth) {
        if (!authService.check(auth, Permission.VIEW_WORK_DONE_BY_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view applications");
        }

        // get all users
        List<User> users = database.people.fetchUsers();
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

        ApplicationType type = database.applications.getApplications().get(applicationId).getType();

        ApplicationStatus status = ApplicationStatus.valueOf(response);
        database.applications.updateApplication(applicationId, type ,status);

        // notify the applicant
        try {
            Application application = database.applications.getApplications().get(applicationId);
            if (application.getType() == ApplicationType.GUIDE) {
                mailService.sendMail(
                        database.people.fetchUser(((GuideApplication) application).getProfile().getContact_info().getEmail()).getProfile().getContact_info().getEmail(),
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
