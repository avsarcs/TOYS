package server.internal.analytics.universities;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AnalyticsUniversitiesController {

    @GetMapping("internal/analytics/universities")
    public void getAll(
            @RequestParam String auth,
            @RequestParam int page_no,
            @RequestParam String search,
            @RequestParam List<String> cities,
            @RequestParam String sort_by,
            @RequestParam String order
    ) {
        // TODO:
    }

    @GetMapping("internal/analytics/universities/rivals")
    public void getRivals(
            @RequestParam String auth,
            @RequestParam int page_no,
            @RequestParam String search,
            @RequestParam List<String> cities,
            @RequestParam String sort_by,
            @RequestParam String order
    ) {

    }

    @GetMapping("internal/analytics/universities/departments")
    public void getDepartments(
            @RequestParam String auth,
            @RequestParam String university_id
    ) {

    }

    @GetMapping("internal/analytics/universities/details")
    public void getDetails(
            @RequestParam String auth,
            @RequestParam String university_id,
            @RequestParam String depertment_id
    ) {

    }

    @PutMapping("internal/analytics/universities/set_rivalry")
    public void setRival(
            @RequestParam String university_id,
            @RequestParam String value_to_set,
            @RequestParam String auth
    ) {

    }
}
