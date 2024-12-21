package server.models.review;

import java.util.Map;

public class ReviewRecord {
    private String event_id;
    private String review_id;
    private ReviewResponse status;

    public String getEvent_id() {
        return event_id;
    }

    public ReviewRecord setEvent_id(String event_id) {
        this.event_id = event_id;
        return this;
    }


    public ReviewRecord() {
    }
    protected ReviewRecord(Map<String, Object> map) {
        this.event_id = (String) map.get("event_id");
        this.review_id = (String) map.get("review_id");
        this.status = ReviewResponse.valueOf((String) map.get("status"));
    }
    public static ReviewRecord fromMap(Map<String, Object> map) {
        return new ReviewRecord(map);
    }

    public ReviewResponse getStatus() {
        return status;
    }

    public ReviewRecord setStatus(ReviewResponse status) {
        this.status = status;
        return this;
    }

    public String getReview_id() {
        return review_id;
    }

    public ReviewRecord setReview_id(String review_id) {
        this.review_id = review_id;
        return this;
    }
}
