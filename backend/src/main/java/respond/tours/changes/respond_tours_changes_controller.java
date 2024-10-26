package respond.tours.changes;

import apply.tour.request_changes.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class respond_tours_changes_controller {

    @Autowired
    RequestService requestService;

    @PostMapping("/respond/tours/changes")
    public void respondToursChangesRequest(@RequestParam String idt, @RequestParam String response) {
        requestService.respondToRequest(idt, response);
    }
}
