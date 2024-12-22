package server.internal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.events.TourRegistry;

import java.util.List;
import java.util.Map;

@RestController
public class EventController {

    @Autowired
    EventService eventService;

    @PostMapping("/internal/event/enroll")
    public void enroll(@RequestParam String auth, @RequestParam String event_id) {
        eventService.enroll(auth, event_id);
    }

    @PostMapping("/internal/event/withdraw")
    public void withdrawFromEvent(@RequestParam String event_id, @RequestParam String auth) {
        eventService.withdrawFromEvent(auth, event_id);
    }

    @PostMapping("/internal/event/invite")
    public void inviteToEvent(@RequestParam String event_id, @RequestParam List<String> guides, @RequestParam String auth) {
        eventService.inviteGuidesToEvent(auth, event_id, guides);
    }

    @PostMapping("/internal/event/remove")
    public void removeFromEvent(@RequestParam String auth, @RequestParam String event_id, @RequestParam List<String> guides) {
        eventService.removeGuides(auth, event_id, guides);
    }
}