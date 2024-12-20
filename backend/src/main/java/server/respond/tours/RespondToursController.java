package server.respond.tours;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
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

    @Deprecated
    @PostMapping("/respond/tours/changes")
    public void respondToursChangesRequest(HttpServletResponse response) {
        response.addHeader("Warning", "This endpoint is deprecated!");
        //requestService.respondToRequest(auth, idt, response_str);
    }


}
