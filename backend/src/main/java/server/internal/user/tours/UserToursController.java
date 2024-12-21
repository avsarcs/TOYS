package server.internal.user.tours;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserToursController {

    @Autowired
    UserTourService tourService;

    @GetMapping("/internal/tours")
    public List<Map<String, Object>> getTours(
            @RequestParam String auth,
            @RequestParam String school_name,
            @RequestParam List<String> status,
            @RequestParam String from_date,
            @RequestParam String to_date,
            @RequestParam boolean filter_guide_missing,
            @RequestParam boolean filter_trainee_missing) {

        return tourService.getTours(auth, school_name, status, from_date, to_date, filter_guide_missing, filter_trainee_missing);
    }

    @PostMapping("/internal/tours/remove")
    public void getTours(@RequestParam String auth, @RequestParam String tid, @RequestParam List<String> guides) {
        tourService.removeGuides(auth, tid, guides);
    }

    @Deprecated
    // this endpoint is used for stating the start and end of a tour
    @PostMapping("/internal/tours/status-update")
    public void updateTourStatus(@RequestParam String tid, @RequestParam String status, @RequestParam String auth) {
        tourService.updateTourStatus(auth,tid, status);
    }

    @PostMapping("/internal/tours/enroll")
    public void enrollInTour(@RequestParam String tid, @RequestParam String auth) {
        tourService.enrollInTour(auth, tid);
    }

    @PostMapping("/internal/tours/withdraw")
    public void withdrawFromTour(@RequestParam String tid, @RequestParam String auth) {
        tourService.withdrawFromTour(auth, tid);
    }

    @PostMapping("/internal/tours/invite")
    public void inviteToTour(@RequestParam String tid, @RequestParam List<String> guides, @RequestParam String auth) {
        tourService.inviteGuidesToTour(auth, tid, guides);
    }

    @PostMapping("/internal/tours/respond")
    public void respondToTourInvite(@RequestParam String application_id, @RequestParam String response, @RequestParam String auth) {
        tourService.respondToTourInvite(auth, application_id, response);
    }
}
