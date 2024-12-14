package server.internal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.events.TourRegistry;

@RestController
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/internal/event/tour")
    public TourRegistry getTour(@RequestParam String auth, @RequestParam String tid) {
        return eventService.getTour(auth, tid);
    }
}
