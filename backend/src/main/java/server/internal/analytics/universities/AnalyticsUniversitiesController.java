package server.internal.analytics.universities;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsUniversitiesController {

    @GetMapping("internal/analytics/universities")
    public List<Map<String, Object>> getAll(
            @RequestParam String auth
        //     @RequestParam int page_no,
        //     @RequestParam String search,
        //     @RequestParam List<String> cities,
        //     @RequestParam String sort_by,
        //     @RequestParam String order
    ) {
        return getAll(auth);
    }

    @GetMapping("internal/analytics/universities")
    public List<Map<String, Object>> getSimpleAll(
            @RequestParam String auth
        //     @RequestParam int page_no,
        //     @RequestParam String search,
        //     @RequestParam List<String> cities,
        //     @RequestParam String sort_by,
        //     @RequestParam String order
    ) {
        return getSimpleAll(auth);
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
        return getRivals(auth);
    }

    @GetMapping("internal/analytics/universities/departments")
    public List<String> getDepartments(
            @RequestParam String auth,
            @RequestParam String university_id
    ) {
        return getDepartments(auth, university_id);
    }

    @GetMapping("internal/analytics/universities/details")
    public Map<String, Object> getDetails(
            @RequestParam String auth,
            @RequestParam String university_id,
            @RequestParam String depertment_id
    ) {
        return getDetails(auth, university_id, depertment_id);
    }

    @PutMapping("internal/analytics/universities/set_rivalry")
    public void setRival(
            @RequestParam String university_id,
            @RequestParam String value_to_set,
            @RequestParam String auth
    ) {
        setRival(university_id, value_to_set, auth);
    }
}
