package server.apply;

import server.models.DTO.DTO_GroupTourApplication;
import server.models.DTO.DTO_GuideApplication;
import server.models.DTO.DTO_IndividualTourApplication;
import server.models.FairApplication;
import server.models.GuideApplication;
import server.models.Request;
import server.models.TourApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApplicationController {
    @Autowired
    ApplicationService applicationService;

    @PostMapping("/server/apply/guide")
    public void applyGuide(@RequestBody DTO_GuideApplication guideApplication) {

        applicationService.applyToBeGuide(GuideApplication.fromDTO(guideApplication));
    }

    @PostMapping("/server/apply/tour")
    public void applyTour(@RequestBody DTO_GroupTourApplication tourApplication) {
        applicationService.applyForATour(TourApplication.fromDTO(tourApplication));
    }

    @PostMapping("/server/apply/tour/individual")
    public void applyTourIndividual(@RequestBody DTO_IndividualTourApplication individualTourApplication) {
        applicationService.applyForATour(TourApplication.fromDTO(individualTourApplication));
    }

    @PostMapping("/server/apply/fair")
    public void applyFair(@RequestBody FairApplication fairApplication) {
        applicationService.applyForAFair(fairApplication);
    }

    @Autowired
    RequestService requestService;

    @PostMapping("/server/apply/tour/request_changes")
    public void requestChanges(@RequestBody Request changeRequest) {
        requestService.addRequest(changeRequest);
    }

}
