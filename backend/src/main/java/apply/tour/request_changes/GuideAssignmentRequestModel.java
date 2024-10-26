package apply.tour.request_changes;

import models.DateWrapper;

import java.time.ZonedDateTime;
import java.util.Map;

public class GuideAssignmentRequestModel extends RequestBase{
    private String guide_id; // which guide to assign
    private String tour_id; // which tour to assign the guide to
    private String advisor_id; // who requested the assignment


    public static GuideAssignmentRequestModel fromMap(Map<String, Object> map) {
        // have to do this casting because setrequested_at returns a base class instance
        return (GuideAssignmentRequestModel) new GuideAssignmentRequestModel()
                .setGuide_id((String) map.get("guide_id"))
                .setTour_id((String) map.get("tour_id"))
                .setAdvisor_id((String) map.get("advisor_id"))
                .setRequested_at(new DateWrapper(ZonedDateTime.parse((String) map.get("requested_at"))));
    }

    public String getAdvisor_id() {
        return advisor_id;
    }

    public GuideAssignmentRequestModel setAdvisor_id(String advisor_id) {
        this.advisor_id = advisor_id;
        return this;
    }

    public String getGuide_id() {
        return guide_id;
    }

    public GuideAssignmentRequestModel setGuide_id(String guide_id) {
        this.guide_id = guide_id;
        return this;
    }

    public String getTour_id() {
        return tour_id;
    }

    public GuideAssignmentRequestModel setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }
}
