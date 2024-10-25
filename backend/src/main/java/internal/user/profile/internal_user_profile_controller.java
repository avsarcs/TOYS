package internal.user.profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class internal_user_profile_controller {

    @Autowired
    UserProfileService userProfileService;

    @GetMapping("/internal/user/profile")
    /// id = user bilkent id, authToken = user's authentication token
    public ProfileModel getProfile(@RequestParam String authToken, @RequestParam String id) {
        return userProfileService.getProfile(id, authToken);
    }
}
