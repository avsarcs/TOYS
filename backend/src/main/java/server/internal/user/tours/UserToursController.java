package server.internal.user.tours;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.DTO_SimpleEvent;

import java.util.List;

@RestController
public class UserToursController {

    @Autowired
    UserTourService tourService;

    // TODO: this needs to be moved to the proper path, "user" tags need to be removed
    @GetMapping("/internal/tours")
    public List<DTO_SimpleEvent> getTours(@RequestParam(name = "auth") String authToken) {
        return tourService.getTours(authToken);
    }

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
    public void inviteToTour(@RequestParam String tid, @RequestParam String guid, @RequestParam String auth) {
        tourService.inviteToTour(auth, tid, guid);
    }

    @PostMapping("/internal/tours/respond")
    public void respondToTourInvite(@RequestParam String idt, @RequestParam String response, @RequestParam String auth) {
        tourService.respondToTourInvite(auth, idt, response);
    }
}
