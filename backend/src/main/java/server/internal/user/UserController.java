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
import java.util.Map;

@RestController
public class UserController {


    @Autowired
    UserService userService;

    // TODO: guide recommendation algo here
    @GetMapping("/internal/user/available-guides")
    public List<Map<String, Object>> getAvailableGuides(@RequestParam String auth, @RequestParam DTO_UserType type, @RequestParam String time) {
        return userService.getAvailableGuides(auth, type, time);
    }

    @GetMapping("/internal/user/guides")
    public List<Map<String, Object>> searchGuides(@RequestParam String auth, @RequestParam String name, @RequestParam String type) {
        return userService.searchGuides(auth, name, type);
    }

    @GetMapping("/internal/user/advisor-offer")
    public List<Map<String, Object>> getAdvisorOffers(@RequestParam String auth, @RequestParam String name, @RequestParam String type, @RequestParam String from_date, @RequestParam String to_date) {
        return userService.getAdvisorOffers(auth, name, type, from_date, to_date);
    }

    @GetMapping("/internal/user/dashboard")
    public List<Map<String, Object>> getDashboardEvents(@RequestParam String auth, @RequestParam String dashboard_category) {
        return userService.getDashboardEvents(auth, dashboard_category);
    }

}
