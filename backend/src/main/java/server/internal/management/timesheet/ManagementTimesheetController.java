package server.internal.management.timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import server.models.payment.DTO_HourlyRate;

import java.util.List;

@RestController
public class ManagementTimesheetController {
    @Autowired
    ManagementTimesheetService managementTimesheetService;

    @PostMapping("/internal/management/timesheet/hourly-rate")
    public void setHourlyRate(@RequestParam String auth, @RequestBody DTO_HourlyRate rate) {
        managementTimesheetService.setHourlyRate(auth, rate);
    }

    @GetMapping("/internal/management/timesheet/hourly-rate")
    public List<DTO_HourlyRate> getRates()
    {
        return managementTimesheetService.getRates();
    }

}
