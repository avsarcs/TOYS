package server.internal.management.people;

import server.models.Application;
import server.models.people.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ManagementPeopleController {
    
    @Autowired
    ManagementPeopleService internalManagementPeopleService;

    @GetMapping ("/server/internal/management/people")
    public List<User> getPeople(@RequestParam String authToken) {
        return internalManagementPeopleService.getPeople(authToken);
    }

    @GetMapping ("/server/internal/management/people/applications")
    public Map<String, Application> getApplications(@RequestParam String authToken) {
        return internalManagementPeopleService.getApplications(authToken);
    }

    @PostMapping ("/server/internal/management/people/applications/respond")
    public void respondToApplication(@RequestParam String authToken, @RequestParam String applicationId, @RequestParam String response) {
        internalManagementPeopleService.respondToApplication(authToken, applicationId, response);
    }

    @PostMapping ("/server/internal/management/people/invite")
    public void inviteUser(@RequestParam String authToken, @RequestParam String invitee, @RequestParam String fairId) {
        internalManagementPeopleService.inviteUserToFair(authToken, invitee, fairId);
    }

    @PostMapping ("/server/internal/management/people/fire")
    public void fireUser(@RequestParam String auth, @RequestParam String firee) {
        internalManagementPeopleService.fireUser(auth, firee);
    }
}
