package internal.user.profile;

import auth.services.JWTService;
import dbm.dbe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserProfileService {


    @Autowired
    dbe databaseEngine;

    public ProfileModel getProfile(String id, String authToken) {
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
        ProfileModel profile = databaseEngine.fetchProfile(id);

        // check if could find the user
        if (profile == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        // return the user profile
        return profile;
    }

    public void updateProfile(ProfileModel profile, String authToken) {
        // Check auth token validity
        // If invalid, return 422
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }

        // check if user match with the auth token
        // If not, return 442
        if (!JWTService.getSimpleton().matchUsername(authToken, profile.getId())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid auth token");
        }
        // update the user profile in the database
        databaseEngine.updateProfile(profile);
    }

}
