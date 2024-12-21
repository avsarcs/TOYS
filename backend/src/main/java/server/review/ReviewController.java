package server.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @PostMapping("/review/tour")
    public void reviewTour(@RequestParam("reviewer_id") String reviewerID, @RequestBody List<Map<String, Object>> reviewMap) {
        reviewService.reviewTour(reviewerID, reviewMap);
    }

    @GetMapping("/review/tour_details")
    public Map<String,Object> getTourDetails(@RequestParam String reviewer_id) {
        return reviewService.getTourDetails(reviewer_id);
    }

    @PostMapping("/review/delete")
    public void deleteReview(@RequestParam String review_id, @RequestParam String auth) {
        reviewService.deleteReview(auth, review_id);
    }

    @PostMapping("/review/respond")
    public void respondReview(@RequestParam String review_id, @RequestParam String response, @RequestParam String auth) {
        reviewService.respondToReview(auth,review_id, response);
    }

    @GetMapping("/review/of_tour")
    public List<Map<String,Object>> getReviewOfTour(@RequestParam String auth, @RequestParam String tour_id) {
        return reviewService.getReviewOfTour(auth, tour_id);
    }

    @GetMapping("/review/of_guide")
    public Map<String,Object> getReviewOfGuide(@RequestParam String auth, @RequestParam String guide_id) {
        return reviewService.getReviewOfGuide(auth, guide_id);
    }
}
