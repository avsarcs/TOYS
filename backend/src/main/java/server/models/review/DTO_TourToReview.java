package server.models.review;

import server.models.DTO.DTO_SimpleGuide;
import server.models.time.ZTime;

import java.util.List;

public class DTO_TourToReview {
    private String tour_id;
    private ZTime tour_date;
    private List<DTO_SimpleGuide> guides;

    public String getTour_id() {
        return tour_id;
    }

    public DTO_TourToReview setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }

    public ZTime getTour_date() {
        return tour_date;
    }

    public DTO_TourToReview setTour_date(ZTime tour_date) {
        this.tour_date = tour_date;
        return this;
    }

    public List<DTO_SimpleGuide> getGuides() {
        return guides;
    }

    public DTO_TourToReview setGuides(List<DTO_SimpleGuide> guides) {
        this.guides = guides;
        return this;
    }
}
