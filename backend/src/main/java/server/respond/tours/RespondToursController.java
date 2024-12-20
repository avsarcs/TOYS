package server.respond.tours;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.apply.RequestService;

@RestController
public class RespondToursController {

    @Autowired
    ResponseManager responseManager;
    /// This endpoint is responsible for responding to tour requests (accept or deny a tour, not details)

    @PostMapping("/respond/tours")
    public void respondTours(@RequestParam String tid /*tour id */, @RequestParam String response, @RequestParam String auth) {
        responseManager.respondToTourRequest(tid, response, auth);
    }


    @Autowired
    RequestService requestService;

    @PostMapping("/respond/tours/changes")
    public void respondToursChangesRequest(@RequestParam String auth, @RequestParam String idt, @RequestParam String response) {
        requestService.respondToRequest(auth, idt, response);
    }


}
