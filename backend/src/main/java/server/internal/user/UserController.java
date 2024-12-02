package server.internal.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.DTO_UserType;

import java.util.List;

@RestController
public class UserController {


    @Autowired
    UserService userService;

    @GetMapping("/internal/user/simple")
    public List<DTO_SimpleGuide> getSimpleGuides(@RequestParam String auth, @RequestParam DTO_UserType type) {
        return userService.getSimpleGuides(auth, type);
    }

    @GetMapping("/internal/user/available_guides")
    public List<DTO_SimpleGuide> getAvailableGuides(@RequestParam String auth, @RequestParam DTO_UserType type, @RequestParam String time) {
        return userService.getAvailableGuides(auth, type, time);
    }
}
