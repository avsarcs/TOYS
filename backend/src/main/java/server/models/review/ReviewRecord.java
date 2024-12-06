package server.models.review;

import server.enums.ApplicationStatus;

public class ReviewRecord {
    private String event_id;
    private ReviewResponse status;
    private String review_id;

    public String getEvent_id() {
        return event_id;
    }

    public ReviewRecord setEvent_id(String event_id) {
        this.event_id = event_id;
        return this;
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
