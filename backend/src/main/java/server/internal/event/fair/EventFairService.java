package server.internal.event.fair;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.Permission;
import server.dbm.Database;
import server.models.DTO.DTOFactory;
import server.models.events.FairRegistry;

import java.util.Map;

@Service
public class EventFairService {

    @Autowired
    DTOFactory dto;

    @Autowired
    Database db;

    @Autowired
    AuthService authService;

    public Map<String, Object> getFair(String auth, String fid) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to access this");
        }

        // get fair
        Map<String, FairRegistry> fairs = db.fairs.fetchFairs();
        if (!fairs.containsKey(fid)) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Fair not found!");
        }

        // return fair
        return dto.fair(fairs.get(fid));
    }
}
