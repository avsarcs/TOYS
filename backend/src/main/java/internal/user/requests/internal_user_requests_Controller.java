package internal.user.requests;

import apply.tour.request_changes.RequestBase;
import apply.tour.request_changes.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class internal_user_requests_Controller {
    @Autowired
    RequestService requestService;
    @GetMapping("/internal/user/requests")
    public List<RequestBase> internalUserRequests(@RequestParam String authToken) {
        return requestService.getRequests(authToken);
    }
}
