package server.models.review;

import java.util.Map;

public class Review {
    private long score;
    private String body;

    public Review() {

    }

    public Review(long score, String body) {
        this.score = score;
        this.body = body;
    }

    protected Review(Map<String, Object> map) {
        this.score = (long) map.get("score");
        this.body = (String) map.get("body");
    }

    static public Review fromMap(Map<String, Object> map) {
        return new Review(map);
    }

    public long getScore() {
        return score;
    }

    public Review setScore(long score) {
        this.score = score;
        return this;
    }

    public String getBody() {
        return body;
    }

    public Review setBody(String body) {
        this.body = body;
        return this;
    }
}
