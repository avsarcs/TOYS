package apply.tour;

import apply.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class apply_tour_controller {
    @Autowired
    ApplicationService applicationService;

    @PostMapping("/apply/tour")
    public void applyTour(@RequestBody TourApplicationModel tourApplication) {
        applicationService.ApplyForATour(tourApplication);
    }
}
