package server.internal.user.profile;

import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.ExperienceLevel;
import server.enums.roles.UserRole;
import server.models.DTO.DTOFactory;
import server.models.DTO.DTO_UserType;
import server.models.people.*;
import server.models.people.details.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserProfileService {

    @Autowired
    DTOFactory dto;

    @Autowired
    Database database;

    @Autowired
    AuthService authService;

    public Map<String, Object> getSimpleGuides(String authToken, String id) {
        // validate jwt token
        if (!authService.check(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (id.isEmpty()) {
            id = JWTService.getSimpleton().decodeUserID(authToken);
        }
        User user = database.people.fetchUser(id);
        if (user instanceof Advisor) {
            Map<String, Object> resposnse =  dto.simpleGuide((Advisor) user);
            resposnse.put("responsible_days", ((Advisor) user).getResponsibleFor());
        } else if (user instanceof Guide) {
            return dto.simpleGuide((Guide) user);
        }

        return Map.of();
    }

    public Map<String, Object> getProfile(String id, String auth) {
        // Check auth token validity
        // If invalid, return 422
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid auth token");
        }

        if (!id.isEmpty()) {
            // check if user match with the auth token
            // If not, return 442
            if (!JWTService.getSimpleton().matchUsername(auth, id)) {
                if (JWTService.getSimpleton().getUserRole(auth).equals(UserRole.GUIDE)) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid auth token");
                }
            }
        } else {
            id = JWTService.getSimpleton().decodeUserID(auth);
        }

        // get the user profile from the database
        User user = database.people.fetchUser(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (user.getRole() == UserRole.COORDINATOR) {
            return Map.of(
                    "id", id,
                    "fullname", user.getProfile().getName(),
                    "role", user.getRole().name(),
                    "email", user.getProfile().getContact_info().getEmail()
            );
        } else if (user.getRole() == UserRole.DIRECTOR) {
            return Map.of(
                    "id", id,
                    "fullname", user.getProfile().getName(),
                    "role", user.getRole().name(),
                    "email", user.getProfile().getContact_info().getEmail()
            );
        }
        Map<String, Object> profile = dto.guide((Guide) user);
        if (user.getRole().equals(UserRole.ADVISOR)) {

            profile.put("responsible_days", ((Advisor) user).getResponsibleFor());
        }
        return profile;
    }

    public void updateProfile(Map<String, Object> profileMap, String auth) {
        System.out.println("Profile Map:");
        for (Map.Entry<String, Object> entry : profileMap.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        // Check auth token validity
        // If invalid, return 422
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid auth token");
        }

        String userID = JWTService.getSimpleton().decodeUserID(auth);
        // get the user
        User user = database.people.fetchUser(userID);
        // form the profile
        Profile profile = null;
        if (user.getRole() == UserRole.GUIDE && user instanceof Guide) {
            profile = ((Guide) user).modifyWithDTO(profileMap).getProfile();
            ((Guide) user).setHigh_school(profile.getHighschool_id());
        } else if (user.getRole() == UserRole.ADVISOR && user instanceof Advisor) {
            profile = ((Advisor) user).modifyWithDTO(profileMap).getProfile();
        } else if (user.getRole() == UserRole.COORDINATOR && user instanceof Coordinator) {
            profile = ((Coordinator) user).modifyWithDTO(profileMap).getProfile();
        } else if (user.getRole() == UserRole.DIRECTOR && user instanceof Director) {
            profile = ((Director) user).modifyWithDTO(profileMap).getProfile();
        } else {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid user role");
        }
        // update profile
        user.setProfile(profile);
        // update the user profile in the database
        database.people.updateUser(user);
    }

}
