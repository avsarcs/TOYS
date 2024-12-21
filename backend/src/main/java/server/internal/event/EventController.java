package server.internal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.events.TourRegistry;

import java.util.Map;

@RestController
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/internal/event/tour")
    public Object getTour(@RequestParam String auth, @RequestParam String tid) {
        return eventService.getTour(auth, tid);
    }

    @GetMapping("/internal/event/simple-tour")
    public Map<String, Object> getSimpletour(@RequestParam String auth, @RequestParam String tid) {
        return eventService.getSimpleTour(auth, tid);
    }

    @PostMapping("/internal/event/tour/start-tour")
    public void startTour(@RequestParam String auth, @RequestParam String tour_id, @RequestParam String start_time) {
        eventService.startTour(auth, tour_id, start_time);
    }

    @PostMapping("/internal/event/tour/end-tour")
    public void endTour(@RequestParam String auth, @RequestParam String tour_id, @RequestParam String end_time) {
        eventService.endTour(auth, tour_id, end_time);
    }
}
