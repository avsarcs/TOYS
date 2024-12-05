package server.internal.user.profile;

import server.auth.JWTService;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.roles.USER_ROLE;
import server.models.DTO.DTO_Guide;
import server.models.people.Advisor;
import server.models.people.Guide;
import server.models.people.User;
import server.models.people.details.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class UserProfileService {

    @Autowired
    Database databaseEngine;

    public Object getProfile(String id, String authToken) {
        // Check auth token validity
        // If invalid, return 422
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }

        if (id != null) {
            // check if user match with the auth token
            // If not, return 442
            if (!JWTService.getSimpleton().matchUsername(authToken, id)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
            }
        } else {
            id = JWTService.getSimpleton().decodeUserID(authToken);
        }
        // get the user profile from the database
        User user = databaseEngine.people.fetchUser(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (user.getRole() == USER_ROLE.GUIDE && user instanceof Guide) {
            return DTO_Guide.fromGuide((Guide) user);
        } else if (user.getRole() == USER_ROLE.ADVISOR && user instanceof Guide) {
            return DTO_Guide.fromGuide((Guide) user);
        } else {
            return null;
        }
    }

    public void updateProfile(Map<String, Object> profileMap, String authToken) {
        // Check auth token validity
        // If invalid, return 422
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }

        String userID = JWTService.getSimpleton().decodeUserID(authToken);
        // get the user
        User user = databaseEngine.people.fetchUser(userID);
        // form the profile
        Profile profile = null;
        if (user.getRole() == USER_ROLE.GUIDE && user instanceof Guide) {
            profile = ((Guide) user).modifyWithDTO(DTO_Guide.fromMap(profileMap)).getProfile();
            ((Guide) user).setHigh_school(profile.getHighschool_id());
        } else if (user.getRole() == USER_ROLE.ADVISOR && user instanceof Advisor) {
            profile = ((Advisor) user).modifyWithDTO(DTO_Guide.fromMap(profileMap)).getProfile();
        } else {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid user role");
        }
        // update profile
        user.setProfile(profile);
        // update the user profile in the database
        databaseEngine.people.updateUser(user);
    }

}
