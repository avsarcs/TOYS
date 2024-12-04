package server.apply.advisor;

import server.apply.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class apply_advisor_Controller {

    @Autowired
    ApplicationService applicationService;

    @PostMapping("/server/apply/advisor")
    public void applyAdvisor(@RequestParam String authToken, @RequestBody AdvisorApplicationModel application) {

    }

}
