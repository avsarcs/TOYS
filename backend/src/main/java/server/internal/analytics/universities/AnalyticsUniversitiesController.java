package server.internal.analytics.universities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsUniversitiesController {
        @Autowired
        AnalyticsUniversitiesService service;

    @GetMapping("internal/analytics/universities/all")
    public List<Map<String, Object>> getAll(
            @RequestParam String auth
        //     @RequestParam int page_no,
        //     @RequestParam String search,
        //     @RequestParam List<String> cities,
        //     @RequestParam String sort_by,
        //     @RequestParam String order
    ) {
        return service.getAll(auth);
    }

    @GetMapping("internal/analytics/universities/all-simple")
    public List<Map<String, Object>> getSimpleAll(
            @RequestParam String auth
        //     @RequestParam int page_no,
        //     @RequestParam String search,
        //     @RequestParam List<String> cities,
        //     @RequestParam String sort_by,
        //     @RequestParam String order
    ) {
        return service.getSimpleAll(auth);
    }
    @GetMapping("internal/analytics/universities/rivals")
    public List<Map<String, Object>> getRivals(
            @RequestParam String auth
        //     @RequestParam int page_no,
        //     @RequestParam String search,
        //     @RequestParam List<String> cities,
        //     @RequestParam String sort_by,
        //     @RequestParam String order
    ) {
        return service.getRivals(auth);
    }

    @GetMapping("internal/analytics/universities/departments")
    public List<String> getDepartments(
            @RequestParam String auth,
            @RequestParam String university_id
    ) {
        return service.getDepartments(auth, university_id);
    }

    @GetMapping("internal/analytics/universities/details")
    public Map<String, Object> getDetails(
            @RequestParam String auth,
            @RequestParam String university_id,
            @RequestParam String department_name
    ) {
        return service.getDetails(auth, university_id, department_name);
    }

    @PostMapping("internal/analytics/universities/set-rivalry")
    public void setRival(
            @RequestParam String university_id,
            @RequestParam String value_to_set,
            @RequestParam String auth
    ) {
        service.setRival(university_id, value_to_set, auth);
    }
}
