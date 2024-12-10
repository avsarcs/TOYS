package server.internal.user.profile;

import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.DTO_UserType;
import server.models.people.details.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserProfileController {

    @Autowired
    UserProfileService userProfileService;

    @GetMapping("/internal/user/profile")
    /// id = user bilkent id, authToken = user's authentication token
    public Object getProfile(@RequestParam String authToken, @RequestParam String id) {
        return userProfileService.getProfile(id, authToken);
    }

    @GetMapping("/internal/user/profile/simple")
    public List<DTO_SimpleGuide> getSimpleGuides(@RequestParam String auth, @RequestParam DTO_UserType type) {
        return userProfileService.getSimpleGuides(auth, type);
    }

    @PostMapping("/internal/user/profile/update")
    public void updateProfile(@RequestBody Map<String, Object> profileMap, @RequestParam String authToken) {
        userProfileService.updateProfile(profileMap, authToken);
    }

}
