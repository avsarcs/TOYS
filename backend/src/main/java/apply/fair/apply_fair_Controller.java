package apply.fair;

import apply.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class apply_fair_Controller {

    @Autowired
    ApplicationService applicationService;

    @PostMapping("/apply/fair")
    public void applyFair(@RequestBody FairApplicationModel fairApplication) {
        HttpStatus status = applicationService.applyForAFair(fairApplication);
        if (status != HttpStatus.OK) {
            throw new ResponseStatusException(status, "Could not apply for a fair");
        }
    }
}
