package server.models.DTO.dataDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import server.models.time.ZTime;

import java.util.Map;

public class DDTO_HighschoolTour {
    private ZTime date;
    private long attendance;
    private double review_rating;
    @JsonProperty("contact")
    private String contact_email;
    private String tour_id;


    protected DDTO_HighschoolTour(Map<String, Object> map) {
        this.date = ZTime.fromMap((Map<String, Object>) map.get("date"));
        this.attendance = (long) map.get("attendance");
        this.review_rating = (double) map.get("review_rating");
        this.contact_email = (String) map.get("contact");
        this.tour_id = (String) map.get("tour_id");
    }

    public static DDTO_HighschoolTour fromMap(Map<String, Object> map) {
        return new DDTO_HighschoolTour(map);
    }
    public DDTO_HighschoolTour() {}
    public ZTime getDate() {
        return date;
    }

    public DDTO_HighschoolTour setDate(ZTime date) {
        this.date = date;
        return this;
    }

    public long getAttendance() {
        return attendance;
    }

    public DDTO_HighschoolTour setAttendance(long attendance) {
        this.attendance = attendance;
        return this;
    }

    public double getReview_rating() {
        return review_rating;
    }

    public DDTO_HighschoolTour setReview_rating(double review_rating) {
        this.review_rating = review_rating;
        return this;
    }

    public String getContact_email() {
        return contact_email;
    }

    public DDTO_HighschoolTour setContact_email(String contact_email) {
        this.contact_email = contact_email;
        return this;
    }

    public String getTour_id() {
        return tour_id;
    }

    public DDTO_HighschoolTour setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }
}
