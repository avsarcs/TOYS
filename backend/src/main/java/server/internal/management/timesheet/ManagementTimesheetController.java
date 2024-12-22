package server.internal.management.timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import server.models.payment.HourlyRate;

import java.util.List;
import java.util.Map;

@RestController
public class ManagementTimesheetController {
    @Autowired
    ManagementTimesheetService managementTimesheetService;

    @PostMapping("/internal/management/timesheet/hourly-rate")
    public void setHourlyRate(@RequestParam String auth, @RequestBody Map<String, Object> rate) {
        managementTimesheetService.setHourlyRate(auth, rate);
    }

    @GetMapping("/internal/management/timesheet/hourly-rate")
    public List<Map<String,Object>> getRates(@RequestParam String auth)
    {
        return managementTimesheetService.getRates(auth);
    }

}
