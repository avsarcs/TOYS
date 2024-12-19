package server.internal.management.timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.DTO_MoneyForGuide;
import server.models.DTO.DTO_MoneyForTour;

import java.util.List;
import java.util.Map;

@RestController
public class ManagementPaymentController {
    @Autowired
    ManagementPaymentService managementPaymentService;

    @GetMapping("/internal/management/timesheet/payment-state/guides")
    public List<Map<String, Object>> getGuidesPaymentState(@RequestParam String auth, @RequestParam String name) {
        return managementPaymentService.getGuidesPaymentState(auth, name);
    }

    @GetMapping("/internal/management/timesheet/payment-state/guide")
    public Map<String, Object> getGuidePaymentState(@RequestParam String auth, @RequestParam String id) {
        return managementPaymentService.getGuidePaymentState(auth, id);
    }

    @GetMapping("/internal/management/timesheet/payment-state/event")
    public List<Map<String, Object>> getEventPaymentState(@RequestParam String auth, @RequestParam String guide_id) {
        return managementPaymentService.getTourPaymentState(auth, guide_id);
    }

    @PostMapping("/internal/management/timesheet/pay/guide")
    public void payGuide(@RequestParam String auth, @RequestParam String guide_id) {
        managementPaymentService.payGuide(auth, guide_id);
    }

}
