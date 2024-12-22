package server.internal.analytics.students;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsStudentsController {

    @Autowired
    AnalyticsStudentsService service;

    @GetMapping("/internal/analytics/students/all")
    public Map<String, Object> getAll(@RequestParam String auth) {
        return service.getAll(auth);
    }

    @GetMapping("/internal/analytics/students/departments")
    public Map<String, Object> getDepartments(@RequestParam String auth, @RequestParam String department) {
        return service.getDepartments(auth, department);
    }

    @GetMapping("/internal/analytics/students/department_high_schools")
    public Map<String, Object> getDepartmentHighSchools(@RequestParam String auth, @RequestParam String department, @RequestParam String year) {
        return service.getDepartmentHighSchools(auth, department, year);
    }
}