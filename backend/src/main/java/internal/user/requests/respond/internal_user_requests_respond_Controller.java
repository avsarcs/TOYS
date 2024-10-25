package internal.user.requests.respond;

import apply.tour.request_changes.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class internal_user_requests_respond_Controller {

    @Autowired
    RequestService requestService;

    @PostMapping("/internal/user/requests/respond")
    public void respondToRequest(@RequestParam String rid, @RequestParam String response) {
        throw new ResponseStatusException(HttpStatus.GONE, "Not implemented");
    }
}
