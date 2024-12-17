package server.apply;

import org.springframework.web.bind.annotation.*;
import server.models.DTO.DTO_GroupTourApplication;
import server.models.DTO.DTO_GuideApplication;
import server.models.DTO.DTO_IndividualTourApplication;
import server.models.events.FairApplication;
import server.models.people.GuideApplication;
import server.models.Request;
import server.models.events.TourApplication;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin
public class ApplicationController {
    @Autowired
    ApplicationService applicationService;


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
    public void applyGuide(@RequestBody DTO_GuideApplication guideApplication) {
        applicationService.applyToBeGuide(GuideApplication.fromDTO(guideApplication));
    }

    @PostMapping("/apply/tour")
    public void applyTour(@RequestBody DTO_GroupTourApplication tourApplication) {
        applicationService.applyForATour(TourApplication.fromDTO(tourApplication));
    }

    @PostMapping("/apply/tour/individual")
    public void applyTourIndividual(@RequestBody DTO_IndividualTourApplication individualTourApplication) {
        applicationService.applyForATour(TourApplication.fromDTO(individualTourApplication));
    }

    @PostMapping("/apply/fair")
    public void applyFair(@RequestBody FairApplication fairApplication) {
        applicationService.applyForAFair(fairApplication);
    }

    @PostMapping("/apply/tour/request_changes")
    public void requestChanges(@RequestBody Request changeRequest) {
        // TODO: This should be delegated to the ApplicationService
        requestService.addRequest(changeRequest);
    }

}
