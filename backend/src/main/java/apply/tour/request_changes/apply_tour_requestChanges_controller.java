package apply.tour.request_changes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class apply_tour_requestChanges_controller {

    @Autowired
    RequestService requestService;

    @PostMapping("/apply/tour/request_changes")
    public void requestChanges(@RequestBody TourChangeRequestModel changeRequest) {
        requestService.requestChanges(changeRequest);
    }
}
