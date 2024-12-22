package server.respond.tours;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.roles.UserRole;
import server.enums.status.ApplicationStatus;
import server.enums.status.TourStatus;
import server.models.events.TourApplication;
import server.models.events.TourRegistry;
import server.models.time.ZTime;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class ResponseManager {

    @Autowired
    Database db;

    public void respondToTourRequest(String tid, String response, String authToken) {
        // validate token
            // if token is invalid, return HttpStatus.UNAUTHORIZED
        if(!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization!");
        }

        // validate user role
            // if user role is not authorized, return HttpStatus.UNPROCESSABLE_ENTITY
        UserRole role = JWTService.getSimpleton().getUserRole(authToken);
        if (!PermissionMap.hasPermission(role, Permission.AR_TOUR_REQUESTS)) {
            throw  new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User does not have enough permissions!");
        }

        // validate response
            // if response is invalid, return HttpStatus.BAD_REQUEST

        AcceptDeny responseEnum;
        try {
            responseEnum = AcceptDeny.valueOf(response.toUpperCase());
        } catch (Exception E) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid response!");
        }

        // validate tour id
            // if tour id is invalid, return HttpStatus.BAD_REQUEST

        try {
            TourApplication application = (TourApplication) db.applications.getApplications().get(tid);
            if (responseEnum == AcceptDeny.ACCEPT) {
                application.setStatus(ApplicationStatus.APPROVED);
            } else {
                application.setStatus(ApplicationStatus.REJECTED);
            }

            TourRegistry tour = new TourRegistry(application);
            tour.setTour_status(TourStatus.CONFIRMED);
            tour.setNotes("");
            tour.setStarted_at(new ZTime(ZonedDateTime.ofInstant(Instant.EPOCH, ZoneId.of("UTC"))));
            tour.setEnded_at(new ZTime(ZonedDateTime.ofInstant(Instant.EPOCH, ZoneId.of("UTC"))));
            tour.setAccepted_time(new ZTime(ZonedDateTime.now()));
            tour.setReviews(List.of());
            tour.setClassroom("");
            tour.setGuides(List.of());

            db.tours.addTour(tour);

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Check logs!");
        }
    }
}
