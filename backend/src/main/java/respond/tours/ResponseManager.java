package respond.tours;

import auth.Permission;
import auth.PermissionMap;
import auth.services.JWTService;
import dbm.dbe;
import enums.roles.USER_ROLE;
import mailService.MailServiceGateway;
import mailService.MailType;
import models.data.tours.TourModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ResponseManager {

    @Autowired
    dbe db;

    @Autowired
    MailServiceGateway mailServiceGateway;

    public HttpStatus respondToTourRequest(String tid, String response, String authToken) {
        // validate token
            // if token is invalid, return HttpStatus.UNAUTHORIZED
        if(!JWTService.getSimpleton().isValid(authToken)) {
            return HttpStatus.UNAUTHORIZED;
        }

        // validate user role
            // if user role is not authorized, return HttpStatus.UNPROCESSABLE_ENTITY
        USER_ROLE role = JWTService.getSimpleton().getUserRole(authToken);
        if (role == null) {
            return HttpStatus.UNPROCESSABLE_ENTITY;
        }
        if (!PermissionMap.hasPermission(role, Permission.AR_TOUR_REQUESTS)) {
            return HttpStatus.UNPROCESSABLE_ENTITY;
        }

        // validate response
            // if response is invalid, return HttpStatus.BAD_REQUEST

        AcceptDeny responseEnum;
        try {
            responseEnum = AcceptDeny.valueOf(response.toUpperCase());
        } catch (Exception E) {
            return HttpStatus.BAD_REQUEST;
        }

        // validate tour id
            // if tour id is invalid, return HttpStatus.BAD_REQUEST

        TourModel tour = db.fetchTours().get(tid);
        if (tour == null) {
            return HttpStatus.BAD_REQUEST;
        }

        // if all valid, update the tour
        tour.accept_deny(responseEnum);
        if(db.updateTour(tour, tid)) {
            mailServiceGateway.sendMail(tour.getApplication().getApplicant().getEmail(), MailType.TOUR_APPLICATION_ACCEPTANCE, Map.of("tour_id", tour.getId()));
            return HttpStatus.OK;
        }
        // return 500 if the server could not update for some reason
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
