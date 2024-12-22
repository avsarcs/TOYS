package server.internal.event.fair;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class EventFairController {

    @Autowired
    EventFairService eventFairService;

    @GetMapping("internal/event/fair")
    public Map<String, Object> getFair(@RequestParam String auth, @RequestParam String fid) {
        return eventFairService.getFair(auth, fid);
    }
}
