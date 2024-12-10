package server.internal.user.requests;

import server.apply.RequestService;
import server.models.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class UserRequestsController {
    @Autowired
    RequestService requestService;

    @GetMapping("/internal/user/requests")
    public List<Request> internalUserRequests(@RequestParam String authToken) {
        return requestService.getRequests(authToken);
    }

    @PostMapping("/internal/user/requests/respond")
    public void respondToRequest(@RequestParam String auth,@RequestParam String rid, @RequestParam String response) {
        requestService.respondToRequest(auth, rid, response);
    }
}
