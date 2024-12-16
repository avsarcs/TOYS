package server.internal.management.timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.payment.DTO_MoneyForGuide;
import server.models.payment.DTO_MoneyForTour;

import java.util.List;

@RestController
public class ManagementPaymentController {
    @Autowired
    ManagementPaymentService managementPaymentService;

    @GetMapping("/internal/management/timesheet/payment-state/guides")
    public List<DTO_MoneyForGuide> getGuidesPaymentState(@RequestParam String auth, @RequestParam String name) {
        return managementPaymentService.getGuidesPaymentState(auth, name);
    }

    @GetMapping("/internal/management/timesheet/payment-state/guide")
    public DTO_MoneyForGuide getGuidePaymentState(@RequestParam String auth, @RequestParam String id) {
        return managementPaymentService.getGuidePaymentState(auth, id);
    }

    @GetMapping("/internal/management/timesheet/payment-state/tour")
    public DTO_MoneyForTour getTourPaymentState(@RequestParam String auth, @RequestParam String id) {
        return managementPaymentService.getTourPaymentState(auth, id);
    }
}
