package server.apply;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import server.models.DTO.DTOFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@RestController
@CrossOrigin
public class ApplicationController {
    @Autowired
    ApplicationService applicationService;

    @Autowired
    DTOFactory dto;

    @Autowired
    RequestService requestService;

    @GetMapping("/apply/tour/isfree")
    public boolean isTourFree(@RequestParam String start, @RequestParam String end) {
        return applicationService.isFree(start, end);
    }

    @GetMapping("/apply/tour/gettype")
    public String getTourType(@RequestParam String uuid) {
        return applicationService.getTourType(uuid);
    }

    @PostMapping("/apply/guide")
    public void applyGuide(@RequestBody Map<String, Object> guideApplication) {
        applicationService.applyToBeGuide(dto.traineeGuideApplication(guideApplication));
    }

    @PostMapping("/apply/tour")
    public void applyTour(@RequestBody Map<String, Object> tourApplication) {

        if (!tourApplication.containsKey("requested_majors")) {
            applicationService.applyForATour(dto.groupTourApplication(tourApplication));
        } else {
            applicationService.applyForATour(dto.individualTourApplication(tourApplication));
        }
    }

    @Deprecated
    @PostMapping("/apply/tour/individual")
    public void applyTourIndividual(@RequestBody Map<String, Object> individualTourApplication) {
        throw new ResponseStatusException(HttpStatus.GONE, "This endpoint is no longer available, use /apply/tour instead");
    }

    @PostMapping("/apply/fair")
    public void applyFair(@RequestBody Map<String,Object> fairApplication) {
        applicationService.applyForAFair(dto.fairApplication(fairApplication));
    }

    @PostMapping("/apply/tour/request_changes")
    public void requestChanges(@RequestBody Map<String, Object> changes, @RequestParam("tour_id") String tour_id, @RequestParam String auth) {
        applicationService.requestChanges(changes, tour_id, auth);
    }

    @PostMapping("/apply/tour/cancel")
    public void cancelEvent(@RequestParam String auth, @RequestParam String event_id, @RequestBody Map<String, Object> reasoning) {
        applicationService.cancelEvent(auth, event_id, reasoning);
    }
}
