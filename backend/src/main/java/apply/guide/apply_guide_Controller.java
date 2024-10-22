package apply.guide;

import apply.ApplicationService;
import dbm.dbe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class apply_guide_Controller {

    @Autowired
    ApplicationService applicationService;

    @PostMapping("/apply/guide")
    public void applyGuide(@RequestBody GuideApplicationModel guideApplication) {
        applicationService.ApplytoBeGuide(guideApplication);
    }
}
