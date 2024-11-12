package internal.management.people;

import auth.Permission;
import auth.PermissionMap;
import auth.services.JWTService;
import dbm.dbe;
import internal.user.profile.ProfileModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.List;

@Service
public class ManagementPeopleService {
    @Autowired
    JWTService jwtService;

    @Autowired
    dbe databaseEngine;

    public List<ProfileModel> getPeople(String authToken) {

        // validate jwt token
        if (!jwtService.isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        // validate permission
        if (!PermissionMap.hasPermission(jwtService.getUserRole(authToken), Permission.VIEW_WORK_DONE_BY_GUIDE)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to view people");
        }

        // get all users
        // get all profiles
        ProfileModel[] profiles = databaseEngine.fetchProfiles().values().toArray(new ProfileModel[0]);
        return List.of(profiles);
    }
}
