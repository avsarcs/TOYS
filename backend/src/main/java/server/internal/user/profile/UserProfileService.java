package server.internal.user.profile;

import server.auth.JWTService;
import server.dbm.Database;
import server.models.people.User;
import server.models.people.details.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserProfileService {

    @Autowired
    Database databaseEngine;

    public Profile getProfile(String id, String authToken) {
        // Check auth token validity
        // If invalid, return 422
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }

        // check if user match with the auth token
        // If not, return 442
        if (!JWTService.getSimpleton().matchUsername(authToken, id)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // get the user profile from the database
        User user = databaseEngine.people.fetchUser(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        Profile profile = user.getProfile();

        // return the user profile
        return profile;
    }

    public void updateProfile(Profile profile, String authToken) {
        // Check auth token validity
        // If invalid, return 422
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }

        String userID = JWTService.getSimpleton().decodeUserID(authToken);
        // get the user
        User user = databaseEngine.people.fetchUser(userID);
        // update profile
        user.setProfile(profile);
        // update the user profile in the database
        databaseEngine.people.updateUser(user);
    }

}
