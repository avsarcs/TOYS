package server.respond;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.apply.RequestService;

@RestController
public class RespondController {

    @Autowired
    RespondService respondService;

    @PostMapping("/respond/application/guide")
    public void respondGuideApplication(@RequestParam String auth, @RequestParam String applicant_id, @RequestParam boolean response) {
        respondService.respondGuideApplication(auth, applicant_id, response);
    }

    @PostMapping("/respond/application/tour")
    public void respondTourApplication(@RequestParam String auth, @RequestParam String application_id, @RequestParam String timeslot) {
        respondService.respondToTourApplication(auth, application_id, timeslot);
    }

    @PostMapping("/respond/application/tour/modification")
    public void respondTourModification(@RequestParam String auth, @RequestParam String tour_id, @RequestParam String accepted_time) {
        respondService.respondToTourModification(auth, tour_id, accepted_time);
    }

    @PostMapping("/respond/application/fair")
    public void respondFairApplication(@RequestParam String auth, @RequestParam String application_id, @RequestParam boolean response) {
        respondService.respondToFairApplication(auth, application_id, response);
    }

    @PostMapping("/respond/guide/fair-invite")
    public void respondFairInvite(@RequestParam String auth, @RequestParam String event_id, @RequestParam boolean response) {
        respondService.respondToFairGuideInvite(auth, event_id, response);
    }

    @PostMapping("/respond/guide/tour-invite")
    public void respondTourInvite(@RequestParam String auth, @RequestParam String event_id, @RequestParam boolean response) {
        respondService.respondToTourGuideInvite(auth, event_id, response);
    }

    @PostMapping("/respond/guide/promotion")
    public void respondGuidePromotion(@RequestParam String auth, @RequestParam String application_id, @RequestParam boolean response) {
        respondService.respondToGuidePromotion(auth, application_id, response);
    }


    @Autowired
    RequestService requestService;

}
