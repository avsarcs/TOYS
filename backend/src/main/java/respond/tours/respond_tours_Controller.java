package respond.tours;

import auth.AuthEntryModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class respond_tours_Controller {

    @Autowired
    ResponseManager responseManager;
    /// This endpoint is responsible for responding to tour requests (accept or deny a tour, not details)
    @PostMapping("/respond/tours")
    public void respondTours(@RequestParam String tid /*tour id */, @RequestParam String response, @RequestBody String authToken) {
        responseManager.respondToTourRequest(tid, response, authToken);
    }

}
