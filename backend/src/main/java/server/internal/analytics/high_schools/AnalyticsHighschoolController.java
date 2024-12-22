package server.internal.analytics.high_schools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import server.models.DTO.dataDTO.DDTO_Highschool;
import server.models.DTO.dataDTO.DDTO_HighschoolDetails;
import server.models.DTO.dataDTO.DDTO_HighschoolTour;
import server.models.schools.Highschool;

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

    @GetMapping("/internal/analytics/high-schools/all-dto")
    public List<Map<String, Object>> getAllDto(@RequestParam String auth){
        return analyticsHighschoolsService.getAllDto(auth);
    }

    @GetMapping("/internal/analytics/high-schools/details")
    public Map<String,Object> getDetails(@RequestParam String auth, @RequestParam String high_school_id) {
        return analyticsHighschoolsService.getDetails(auth, high_school_id);
    }

    @GetMapping("/internal/analytics/high-schools/tour-reviews")
    public Map<String, Object> getTourReviews(@RequestParam String auth, @RequestParam String high_school_id, @RequestParam String tour_id) {
        return analyticsHighschoolsService.getTourReviews(auth, high_school_id, tour_id);
    }

    @GetMapping("/internal/analytics/high-schools/students")
    public Map<String, Object> getStudents(@RequestParam String auth, @RequestParam String high_school_id, @RequestParam String year) {
        return analyticsHighschoolsService.getStudents(auth, high_school_id, year);
    }

    @PostMapping("/internal/analytics/high-schools/edit")
    public void editHighSchool(@RequestBody Map<String, Object> highschool, @RequestParam String auth) {
        analyticsHighschoolsService.editHighSchool(auth, highschool);
    }

    @PostMapping("/internal/analytics/high-schools/add")
    public void addHighSchool(@RequestBody Map<String, Object> highschool, @RequestParam String auth) {
        analyticsHighschoolsService.addHighSchool(auth, highschool);
    }

}
