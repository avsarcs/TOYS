package server.internal.event.tour;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.internal.event.EventService;

import java.util.List;
import java.util.Map;

@RestController
public class EventTourController {

    @Autowired
    EventTourService eventTourService;


    @GetMapping("/internal/event/tour")
    public Object getTour(@RequestParam String auth, @RequestParam String tour_id) {
        return eventTourService.getTour(auth, tour_id);
    }

        @GetMapping("/internal/event/tour/simple")
        public Map<String, Object> getSimpletour(@RequestParam String auth, @RequestParam String tour_id) {
            return eventTourService.getSimpleTour(auth, tour_id);
        }

        @PostMapping("/internal/event/tour/start-tour")
        public void startTour(@RequestParam String auth, @RequestParam String tour_id, @RequestParam String start_time) {
            eventTourService.startTour(auth, tour_id, start_time);
        }

        @PostMapping("/internal/event/tour/end-tour")
        public void endTour(@RequestParam String auth, @RequestParam String tour_id, @RequestParam String end_time) {
            eventTourService.endTour(auth, tour_id, end_time);
        }


        @GetMapping("/internal/event/tour/search")
        public List<Map<String, Object>> searchTours(
                @RequestParam String auth,
                @RequestParam String school_name,
                @RequestParam List<String> status,
                @RequestParam String from_date,
                @RequestParam String to_date,
                @RequestParam boolean filter_guide_missing,
                @RequestParam boolean filter_trainee_missing,
                @RequestParam boolean am_enrolled,
                @RequestParam boolean am_invited
        ) {

            return eventTourService.searchTours(auth, school_name, status, from_date, to_date, filter_guide_missing, filter_trainee_missing, am_enrolled, am_invited);
        }
}
