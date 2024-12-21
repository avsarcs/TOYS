package server.internal.management.fairs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.DTO_Fair;

import java.util.List;
import java.util.Map;

@RestController
public class ManagementFairController {

    @Autowired
    ManagementFairService internalManagementFairService;

    @GetMapping("/internal/management/fairs")
    public List<Map<String, Object>> getFairs(
            @RequestParam String auth,
            @RequestParam String status,
            @RequestParam String guide_not_assigned,
            @RequestParam String enrolled_in_fair,
            @RequestParam String school_name,
            @RequestParam String to_date,
            @RequestParam String from_date,
            @RequestParam String filter_guide_missing,
            @RequestParam String filter_trainee_missing
    ) {
        return internalManagementFairService.getFairs(auth, status, guide_not_assigned, enrolled_in_fair, school_name, to_date, from_date, filter_guide_missing, filter_trainee_missing);
    }

    @PostMapping("/internal/management/fairs/respond")
    public void respondToFair(@RequestParam String auth, @RequestParam String fairID, @RequestParam String response)  {
        internalManagementFairService.respondToFairInvitation(auth, fairID, response);
    }
}
