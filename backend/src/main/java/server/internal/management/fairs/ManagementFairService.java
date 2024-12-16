package server.internal.management.fairs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.status.ApplicationStatus;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTO_Fair;
import server.models.events.FairRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ManagementFairService {

    @Autowired
    Database database;

    @Autowired
    MailServiceGateway mailService;

    public List<DTO_Fair> getFairs(String auth) {
        // validate token and permission
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), Permission.AR_FAIR_INVITATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view fairs!");
        }

        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();
        List<DTO_Fair> dtoFairs = new ArrayList<>();
        for (Map.Entry<String, FairRegistry> entry : fairs.entrySet()) {
            dtoFairs.add(DTO_Fair.fromFair( entry.getValue()));
        }
        return dtoFairs;
    }

    public void respondToFairInvitation(String auth, String fairID, String response) {
        // validate token and permission
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), Permission.AR_FAIR_INVITATIONS)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view fairs!");
        }

        // check if fair exists
        if (database.fairs.fetchFairs().keySet().stream().noneMatch(k -> k.equals(fairID))) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Fair does not exist!");
        }

        // check if response is valid
        ApplicationStatus status = null;
        try {
            status = ApplicationStatus.valueOf(response);
        } catch (Exception e) {

        }
        if (status == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid response!");
        }

        FairRegistry fair = database.fairs.fetchFairs().get(fairID);
        fair.setStatus(status);
        database.fairs.updateFair(fair, fairID);

        try {
            Status mailStatus = Status.APPROVAL;
            if (status == ApplicationStatus.REJECTED) {
                mailStatus = Status.REJECTION;
            } else if (status == ApplicationStatus.RECIEVED) {
                mailStatus = Status.RECIEVED;
            }
            mailService.sendMail(
                    fair.getApplicant().getContact_info().getEmail(),
                    Concerning.EVENT_APPLICANT,
                    About.FAIR_APPLICATION,
                    mailStatus,
                    Map.of(
                            "event_id", fairID,
                            "event_name", fair.getFair_name(),
                            "status", status.toString()
                    )

            );
        } catch (Exception e) {
            System.out.println("Error while trying to send a mail");
        }
    }
}
