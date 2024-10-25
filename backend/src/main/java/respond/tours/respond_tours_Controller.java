package respond.tours;

import auth.AuthEntryModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class respond_tours_Controller {

    @Autowired
    ResponseManager responseManager;
    /// This endpoint is responsible for responding to tour requests (accept or deny a tour, not details)
    @PostMapping("/respond/tours")
    public void respondTours(@RequestParam String tid /*tour id */, @RequestParam String response, @RequestBody String authToken) {
        HttpStatus status = responseManager.respondToTourRequest(tid, response, authToken);
        if (status != HttpStatus.OK) {
            throw new ResponseStatusException(status, "Could not respond to tour request");
        }
    }

}
