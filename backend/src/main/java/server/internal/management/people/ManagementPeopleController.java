package server.internal.management.people;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
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

    @PostMapping ("/internal/management/people/fire")
    public void fireUser(@RequestParam String auth, @RequestParam String firee) {
        internalManagementPeopleService.fireUser(auth, firee);
    }

    @PostMapping ("/internal/management/people/promote")
    public void promoteUser(@RequestParam String auth, @RequestParam String user_id) {
        internalManagementPeopleService.promoteUser(auth, user_id);
    }

    @GetMapping ("/internal/management/people")
    public List<User> getPeople() {
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "This endpoint is not implemented");
        //return internalManagementPeopleService.getPeople(auth);
    }


    @Deprecated
    @GetMapping ("/internal/management/people/applications")
    public Map<String, Application> getApplications() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "This endpoint is deprecated");
    }

    @Deprecated
    @PostMapping ("/internal/management/people/applications/respond")
    public void respondToApplication() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "This endpoint is deprecated");
    }

    @Deprecated
    @PostMapping ("/internal/management/people/invite")
    public void inviteUser() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "This endpoint is deprecated");
    }

}
