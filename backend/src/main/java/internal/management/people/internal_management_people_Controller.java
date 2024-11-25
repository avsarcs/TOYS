package internal.management.people;

import internal.user.profile.ProfileModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class internal_management_people_Controller {
    @Autowired
    ManagementPeopleService internalManagementPeopleService;


    @GetMapping ("/internal/management/people")
    public List<ProfileModel> getPeople(@RequestParam String authToken) {
        return internalManagementPeopleService.getPeople(authToken);
    }

    @GetMapping ("/internal/management/people/applications")
    public List<String>
}
