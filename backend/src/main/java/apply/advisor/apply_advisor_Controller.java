package apply.advisor;

import apply.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.annotation.ApplicationScope;

@RestController
public class apply_advisor_Controller {

    @Autowired
    ApplicationService applicationService;
    @PostMapping("/apply/advisor")
    public void applyAdvisor(@RequestParam String authToken, @RequestBody AdvisorApplicationModel application) {

    }

}
