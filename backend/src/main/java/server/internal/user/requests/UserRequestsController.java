package server.internal.user.requests;

import server.apply.RequestService;
import server.models.requests.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserRequestsController {
    @Autowired
    RequestService requestService;

    @GetMapping("/internal/user/requests")
    public List<Request> internalUserRequests(@RequestParam String auth) {
        return requestService.getRequests(auth);
    }

    @PostMapping("/internal/user/requests/respond")
    public void respondToRequest(@RequestParam String auth,@RequestParam String rid, @RequestParam String response) {
        requestService.respondToRequest(auth, rid, response);
    }
}
