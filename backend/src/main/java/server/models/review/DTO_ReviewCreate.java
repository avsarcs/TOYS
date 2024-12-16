package server.models.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import server.enums.roles.Reviewee;
import server.models.DTO.DTO_SimpleGuide;
import server.models.time.ZTime;

import java.util.List;
import java.util.Map;

public class DTO_ReviewCreate {
    @JsonProperty("for")
    private Reviewee reviewee;
    private String tour_id;
    private ZTime tour_date;
    private List<DTO_SimpleGuide> guides;
    private long score;
    private String body;


    public DTO_ReviewCreate() {
    }

    protected DTO_ReviewCreate(Map<String, Object> map) {
        this.reviewee = Reviewee.valueOf((String) map.get("for"));
        this.tour_id = (String) map.get("tour_id");
        this.tour_date = new ZTime((String) map.get("tour_date"));
        this.guides = (List<DTO_SimpleGuide>) map.get("guides");
        this.score = (long) map.get("score");
        this.body = (String) map.get("body");
    }

    public static DTO_ReviewCreate fromMap(Map<String, Object> map) {
        return new DTO_ReviewCreate(map);
    }

    public String getTour_id() {
        return tour_id;
    }

    public DTO_ReviewCreate setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }

    public ZTime getTour_date() {
        return tour_date;
    }

    public DTO_ReviewCreate setTour_date(ZTime tour_date) {
        this.tour_date = tour_date;
        return this;
    }

    public List<DTO_SimpleGuide> getGuides() {
        return guides;
    }

    public DTO_ReviewCreate setGuides(List<DTO_SimpleGuide> guides) {
        this.guides = guides;
        return this;
    }

    public long getScore() {
        return score;
    }

    public DTO_ReviewCreate setScore(long score) {
        this.score = score;
        return this;
    }

    public String getBody() {
        return body;
    }

    public DTO_ReviewCreate setBody(String body) {
        this.body = body;
        return this;
    }

    public Reviewee getReviewee() {
        return reviewee;
    }
}
