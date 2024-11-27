package server.models.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.dbm.Database;
import server.models.FairRegistry;
import server.models.TourRegistry;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

public class DTO_SimpleEvent {

    private String id;
    private DTO_Highschool high_school;
    private String time;
    private long visitor_count;
    private List<DTO_SimpleGuide> guide;

    public static DTO_SimpleEvent fromEvent(TourRegistry tour) {
        DTO_SimpleEvent dto = new DTO_SimpleEvent();
        dto.setId(tour.getTour_id());
        dto.setHigh_school(new DTO_Highschool(tour.getApplicant().getSchool()));
        dto.setTime(tour.getAccepted_time().toString());
        dto.setVisitor_count(tour.getExpected_souls());
        if (tour.getGuides().isEmpty()) {
            dto.setGuide(new ArrayList<>());
        } else {
            List<DTO_SimpleGuide> guides_ = new ArrayList<>();
            List<String> guideIDs = tour.getGuides();
            for (String guid : guideIDs) {
                guides_.add(DTO_SimpleGuide.fromGuide(Database.getInstance().people.fetchGuides(guid).get(0)));
            }
            dto.setGuide(guides_);
        }
        return dto;
    }
    public static DTO_SimpleEvent fromEvent(FairRegistry fair) {
        DTO_SimpleEvent dto = new DTO_SimpleEvent();
        dto.setId(fair.getFair_id());
        dto.setHigh_school(new DTO_Highschool(fair.getApplicant().getSchool()));
        dto.setTime(fair.getStarts_at().toString());
        dto.setVisitor_count(-1);
        if (fair.getGuides().isEmpty()) {
            dto.setGuide(new ArrayList<>());
        } else {
            List<DTO_SimpleGuide> guides_ = new ArrayList<>();
            List<String> guideIDs = fair.getGuides();
            for (String guid : guideIDs) {
                guides_.add(DTO_SimpleGuide.fromGuide(Database.getInstance().people.fetchGuides(guid).get(0)));
            }
            dto.setGuide(guides_);
        }
        return dto;
    }

    public String getId() {
        return id;
    }

    public DTO_SimpleEvent setId(String id) {
        this.id = id;
        return this;
    }

    public DTO_Highschool getHigh_school() {
        return high_school;
    }

    public DTO_SimpleEvent setHigh_school(DTO_Highschool high_school) {
        this.high_school = high_school;
        return this;
    }

    public String getTime() {
        return time;
    }

    public DTO_SimpleEvent setTime(String time) {
        this.time = time;
        return this;
    }

    public long getVisitor_count() {
        return visitor_count;
    }

    public DTO_SimpleEvent setVisitor_count(long visitor_count) {
        this.visitor_count = visitor_count;
        return this;
    }

    public List<DTO_SimpleGuide> getGuide() {
        return guide;
    }

    public DTO_SimpleEvent setGuide(List<DTO_SimpleGuide> guide) {
        this.guide = guide;
        return this;
    }
}
