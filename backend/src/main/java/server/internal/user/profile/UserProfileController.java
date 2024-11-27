package server.internal.user.profile;

import server.models.DTO.DTO_SimpleGuide;
import server.models.people.details.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserProfileController {

    @Autowired
    UserProfileService userProfileService;

    @GetMapping("/server/internal/user/profile")
    /// id = user bilkent id, authToken = user's authentication token
    public Profile getProfile(@RequestParam String authToken, @RequestParam String id) {
        return userProfileService.getProfile(id, authToken);
    }

   /* @PostMapping("/server/internal/user/profile/update")
    public void updateProfile(@RequestBody Map<String,Object> profileMap, @RequestParam String authToken) {
        userProfileService.updateProfile(Profile.fromMap(profileMap), authToken);
    }*/

    @PostMapping("/server/internal/user/profile/update")
    public void updateProfile(@RequestBody Profile profileMap, @RequestParam String authToken) {
        userProfileService.updateProfile(profileMap, authToken);
    }

}
