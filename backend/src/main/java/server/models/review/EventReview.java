package server.models.review;

import java.util.Map;

public class EventReview {

    Map<String, Review> guide_reviews;
    private String event_id;
    private Review event_review;


    protected EventReview(Map<String, Object> map) {
        this.guide_reviews = (Map<String, Review>) map.get("guide_reviews");
        this.event_id = (String) map.get("event_id");
        this.event_review = Review.fromMap((Map<String, Object>) map.get("event_review"));
    }

    public static EventReview fromMap(Map<String, Object> map) {
        return new EventReview(map);
    }

    public EventReview(Map<String, Review> guide_reviews, String event_id, Review event_review) {
        this.guide_reviews = guide_reviews;
        this.event_id = event_id;
        this.event_review = event_review;
    }

    public EventReview() {
    }

    public Map<String, Review> getGuide_reviews() {
        return guide_reviews;
    }

    public EventReview setGuide_reviews(Map<String, Review> guide_reviews) {
        this.guide_reviews = guide_reviews;
        return this;
    }

    public String getEvent_id() {
        return event_id;
    }

    public EventReview setEvent_id(String event_id) {
        this.event_id = event_id;
        return this;
    }

    public Review getEvent_review() {
        return event_review;
    }

    public EventReview setEvent_review(Review event_review) {
        this.event_review = event_review;
        return this;
    }
}
