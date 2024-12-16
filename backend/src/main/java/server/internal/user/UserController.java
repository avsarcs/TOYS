package server.internal.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.DTO_AdvisorOffer;
import server.models.DTO.DTO_SimpleEvent;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.DTO_UserType;

import java.util.List;

@RestController
public class UserController {


    @Autowired
    UserService userService;

    @GetMapping("/internal/user/available_guides")
    public List<DTO_SimpleGuide> getAvailableGuides(@RequestParam String auth, @RequestParam DTO_UserType type, @RequestParam String time) {
        return userService.getAvailableGuides(auth, type, time);
    }

    @GetMapping("/internal/user/guides")
    public List<DTO_SimpleGuide> searchGuides(@RequestParam String auth, @RequestParam String name, @RequestParam String type) {
        return userService.searchGuides(auth, name, type);
    }

    @GetMapping("/internal/user/advisor_offer")
    public List<DTO_AdvisorOffer> getAdvisorOffers(@RequestParam String auth, @RequestParam String name, @RequestParam String type, @RequestParam String from_date, @RequestParam String to_date) {
        return userService.getAdvisorOffers(auth, name, type, from_date, to_date);
    }

    @GetMapping("/internal/user/dashboard")
    public List<DTO_SimpleEvent> getDashboardEvents(@RequestParam String auth, @RequestParam String category) {
        return userService.getDashboardEvents(auth, category);
    }

}
