package server.internal.event.fair;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class EventFairController {

    @Autowired
    EventFairService eventFairService;

    @GetMapping("internal/event/fair")
    public Map<String, Object> getFair(@RequestParam String auth, @RequestParam String fair_id) {
        return eventFairService.getFair(auth, fair_id);
    }

    @GetMapping("/internal/event/fair/search")
    public List<Map<String, Object>> getFairs(
            @RequestParam String auth,
            @RequestParam List<String> status,
            @RequestParam String guide_not_assigned,
            @RequestParam String enrolled_in_fair,
            @RequestParam String school_name,
            @RequestParam String to_date,
            @RequestParam String from_date,
            @RequestParam String filter_guide_missing,
            @RequestParam String filter_trainee_missing
    ) {
        return eventFairService.searchFairs(auth, status, guide_not_assigned, enrolled_in_fair, school_name, to_date, from_date, filter_guide_missing, filter_trainee_missing);
    }
}
