package server.internal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.types.TourType;
import server.models.DTO.DTO_GroupTour;
import server.models.DTO.DTO_IndividualTour;
import server.models.events.TourRegistry;

@Service
public class EventService {

    @Autowired
    JWTService jwtService;

    @Autowired
    Database database;

    public Object getTour(String auth, String tid) {
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

        TourRegistry tourR = database.tours.fetchTour(tid);
        Object tour = null;
        if (tourR.getTour_type() == TourType.GROUP) {
            tour = DTO_GroupTour.fromTourRegistry(tourR);
        } else if (tourR.getTour_type() == TourType.INDIVIDUAL) {
            tour = DTO_IndividualTour.fromTourRegistry(tourR);
        }

        return tour;
    }
}
