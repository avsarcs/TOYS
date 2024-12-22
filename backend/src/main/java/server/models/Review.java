package server.models;

import server.enums.Rating;
import server.enums.types.ReviewType;

import java.util.Map;

public class Review {
    public Review() {

    }

    protected Review(Map<String,Object> map) {
        this.type = ReviewType.valueOf((String) map.get("type"));
        this.reviewee = (String) map.get("reviewee");
        this.rating = Rating.valueOf((String) map.get("rating"));
        this.review = (String) map.get("review");
    }

    public ReviewType getType() {
        return type;
    }

    public Review setType(ReviewType type) {
        this.type = type;
        return this;
    }

    public String getReviewee() {
        return reviewee;
    }

    public Review setReviewee(String reviewee) {
        this.reviewee = reviewee;
        return this;
    }

    public Rating getRating() {
        return rating;
    }

    public Review setRating(Rating rating) {
        this.rating = rating;
        return this;
    }

    public String getReview() {
        return review;
    }

    public Review setReview(String review) {
        this.review = review;
        return this;
    }

    public static Review fromMap(Map<String, Object> map) {
        return new Review(map);
    }

    private ReviewType type;
    private String reviewee;
    private Rating rating;
    private String review;
}
