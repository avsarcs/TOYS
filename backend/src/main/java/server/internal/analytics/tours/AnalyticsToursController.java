package server.internal.analytics.tours;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AnalyticsToursController {

    @Autowired
    AnalyticsToursService analyticsToursService;

    @GetMapping("/internal/analytics/tours")
    public Map<String, Object> getTours(@RequestParam String auth) {
        return analyticsToursService.getTours(auth);
    }
}
