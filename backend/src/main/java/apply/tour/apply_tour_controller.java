package apply.tour;

import apply.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class apply_tour_controller {
    @Autowired
    ApplicationService applicationService;

    @PostMapping("/apply/tour")
    public void applyTour(@RequestBody TourApplicationModel tourApplication) {
        HttpStatus status = applicationService.ApplyForATour(tourApplication);
        if (status != HttpStatus.OK) {
            throw new ResponseStatusException(status, "Could not apply for a tour");
        }
    }

    @PostMapping("/apply/tour/individual")
    public void applyTourIndividual(@RequestBody TourApplicationModel individualTourApplication) {
        HttpStatus status = applicationService.ApplyForATour(individualTourApplication);
        if (status != HttpStatus.OK) {
            throw new ResponseStatusException(status, "Could not apply for an individual tour");
        }
    }
}
