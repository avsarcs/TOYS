package server.apply.advisor;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
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

    @Deprecated
    @PostMapping("/server/apply/advisor")
    public void applyAdvisor(@RequestParam String authToken, @RequestBody AdvisorApplicationModel application) {
        throw new ResponseStatusException(HttpStatus.FAILED_DEPENDENCY, "This endpoint is deprecated! Please consult the documentation.");
    }

}
