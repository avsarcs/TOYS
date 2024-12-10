package server.internal.user.profile;

import server.auth.JWTService;
import server.dbm.Database;
import server.enums.ExperienceLevel;
import server.enums.roles.UserRole;
import server.models.DTO.DTO_Guide;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.DTO_UserType;
import server.models.people.Advisor;
import server.models.people.Guide;
import server.models.people.User;
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
    Database database;


    public List<DTO_SimpleGuide> getSimpleGuides(String authToken, DTO_UserType type) {
        List<DTO_SimpleGuide> guides = new ArrayList<>();
        // validate jwt token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        List<Guide> people = database.people.fetchGuides(null);
        people.addAll(database.people.fetchAdvisors(null));
        for (Guide guide : people) {
            if (type == DTO_UserType.TRAINEE) {
                if (guide.getExperience().getExperienceLevel_level() == ExperienceLevel.TRAINEE) {
                    guides.add(DTO_SimpleGuide.fromGuide(guide));
                }
            } else if (type == DTO_UserType.GUIDE) {
                if (guide.getExperience().getExperienceLevel_level() != ExperienceLevel.TRAINEE) {
                    if (guide.getRole() == UserRole.GUIDE) {
                        guides.add(DTO_SimpleGuide.fromGuide(guide));
                    }
                }
            } else if (type == DTO_UserType.ADVISOR){
                if (guide.getRole() == UserRole.ADVISOR) {
                    guides.add(DTO_SimpleGuide.fromGuide(guide));
                }
            }
        }

        return guides;
    }

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
        User user = database.people.fetchUser(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (user.getRole() == UserRole.GUIDE && user instanceof Guide) {
            return DTO_Guide.fromGuide((Guide) user);
        } else if (user.getRole() == UserRole.ADVISOR && user instanceof Guide) {
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
        User user = database.people.fetchUser(userID);
        // form the profile
        Profile profile = null;
        if (user.getRole() == UserRole.GUIDE && user instanceof Guide) {
            profile = ((Guide) user).modifyWithDTO(DTO_Guide.fromMap(profileMap)).getProfile();
            ((Guide) user).setHigh_school(profile.getHighschool_id());
        } else if (user.getRole() == UserRole.ADVISOR && user instanceof Advisor) {
            profile = ((Advisor) user).modifyWithDTO(DTO_Guide.fromMap(profileMap)).getProfile();
        } else {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid user role");
        }
        // update profile
        user.setProfile(profile);
        // update the user profile in the database
        database.people.updateUser(user);
    }

}
