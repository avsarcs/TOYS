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

    public static Review fromMap(Map<String, Object> map) {
        return new Review(map);
    }

    private ReviewType type;
    private String reviewee;
    private Rating rating;
    private String review;
}
