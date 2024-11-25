package internal.user.tours;

import apply.tour.request_changes.RequestService;
import models.data.tours.TourModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class internal_user_tours_controller {

    @Autowired
    TourService tourService;

    @GetMapping("/internal/user/tours")
    public List<TourModel> getTours(@RequestParam String authToken) {
        return tourService.getTours(authToken);
    }

    // this endpoint is used for stating the start and end of a tour
    @PostMapping("/internal/user/tours/status-update")
    public void updateTourStatus(@RequestParam String tid, @RequestParam String status, @RequestParam String authToken) {
        // TODO: Incomplete
        tourService.updateTourStatus(authToken,tid, status);
    }

    @PostMapping("/internal/user/tours/enroll")
    public void enrollInTour(@RequestParam String tid, @RequestParam String authToken) {
        tourService.enrollInTour(authToken, tid);
    }

    @PostMapping("/internal/user/tours/withdraw")
    public void withdrawFromTour(@RequestParam String tid, @RequestParam String authToken) {
        tourService.withdrawFromTour(authToken, tid);
    }

    @PostMapping("/internal/user/tours/invite")
    public void inviteToTour(@RequestParam String tid, @RequestParam String guid, @RequestParam String authToken) {
        tourService.inviteToTour(authToken, tid, guid);
    }

    @PostMapping("/internal/user/tours/respond")
    public void respondToTourInvite(@RequestParam String idt, @RequestParam String response, @RequestParam String authToken) {
        tourService.respondToTourInvite(authToken, idt, response);
    }
}
