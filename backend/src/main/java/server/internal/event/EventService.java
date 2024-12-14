package server.internal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.models.events.TourRegistry;

@Service
public class EventService {

    @Autowired
    JWTService jwtService;

    @Autowired
    Database database;

    public TourRegistry getTour(String auth, String tid) {
        if (!JWTService.testToken.equals(auth)) {
            // validate token
            if(!JWTService.getSimpleton().isValid(auth)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }

            // check permissions
            if (!PermissionMap.hasPermission(
                    JWTService.getSimpleton().getUserRole(auth),
                    Permission.VIEW_TOUR_INFO)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
        }

        return database.tours.fetchTour(tid);
    }
}
