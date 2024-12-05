package server.internal.management.fairs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.models.DTO.DTO_Fair;

import java.util.List;

@RestController
public class ManagementFairController {

    @Autowired
    ManagementFairService internalManagementFairService;

    @GetMapping("/internal/management/fairs")
    public List<DTO_Fair> getFairs(@RequestParam String auth) {
        return internalManagementFairService.getFairs(auth);
    }

    @PostMapping("/internal/management/fairs/respond")
    public void respondToFair(@RequestParam String auth, @RequestParam String fairID, @RequestParam String response)  {

    }
}
