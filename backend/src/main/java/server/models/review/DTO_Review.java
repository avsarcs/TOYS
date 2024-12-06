package server.models.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import server.enums.Reviewee;

import java.util.Map;

public class DTO_Review extends DTO_ReviewCreate{
    private String id;
    private boolean approved;

    public static DTO_Review merge(DTO_ReviewCreate reviewC, ReviewRecord record) {
        DTO_Review review = new DTO_Review();

        review
                .setBody(reviewC.getBody())
                .setGuides(reviewC.getGuides())
                .setScore(reviewC.getScore())
                .setTour_date(reviewC.getTour_date())
                .setTour_id(reviewC.getTour_id());

        review.setId(record.getReview_id());
        if (record.getStatus() == ReviewResponse.APPROVED || record.getStatus() == ReviewResponse.PARTIAL) {
            review.setApproved(true);
        } else {
            review.setApproved(false);
        }

        return review;
    }

    protected DTO_Review(Map<String, Object> map) {
        super(map);
        this.id = (String) map.get("id");
        this.approved = (boolean) map.get("approved");
    }

    public static DTO_Review fromMap(Map<String, Object> map) {
        return new DTO_Review(map);
    }

    public DTO_Review() {
    }

    public String getId() {
        return id;
    }

    public DTO_Review setId(String id) {
        this.id = id;
        return this;
    }

    public boolean isApproved() {
        return approved;
    }

    public DTO_Review setApproved(boolean approved) {
        this.approved = approved;
        return this;
    }
}