package server.internal.analytics.high_schools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.dataDTO.DDTO_Highschool;
import server.models.DTO.dataDTO.DDTO_HighschoolDetails;
import server.models.DTO.dataDTO.DDTO_HighschoolTour;

import java.util.List;

@RestController
public class AnalyticsHighschoolController {

    @Autowired
    AnalyticsHighschoolService analyticsHighschoolsService;

    @GetMapping("/internal/analytics/high-schools/all")
    public List<DDTO_Highschool> getAll(@RequestParam String auth) {
        return analyticsHighschoolsService.getAll(auth);
    }

    @GetMapping("/internal/analytics/high-schools/details")
    public DDTO_HighschoolDetails getDetails(@RequestParam String auth, @RequestParam String high_school_id) {
        return analyticsHighschoolsService.getDetails(auth, high_school_id);
    }
}
