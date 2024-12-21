package server.internal.analytics.high_schools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.dataDTO.DDTO_Highschool;
import server.models.DTO.dataDTO.DDTO_HighschoolDetails;
import server.models.DTO.dataDTO.DDTO_HighschoolTour;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsHighschoolController {

    @Autowired
    AnalyticsHighschoolService analyticsHighschoolsService;

    @GetMapping("/internal/analytics/high-schools/all")
    public List<Map<String, Object>> getAll(@RequestParam String auth) {
        return analyticsHighschoolsService.getAll(auth);
    }

    @GetMapping("/internal/analytics/high-schools/details")
    public Map<String,Object> getDetails(@RequestParam String auth, @RequestParam String high_school_id) {
        return analyticsHighschoolsService.getDetails(auth, high_school_id);
    }

    @GetMapping("/internal/analytics/high-schools/students")
    public void getIncomingStudents(@RequestParam String auth, @RequestParam String high_school_id, @RequestParam String year) {
        //analyticsHighschoolsService.getIncomingStudents(auth, high_school_id, year);
    }


}
