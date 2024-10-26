package apply.tour.request_changes;

import models.DateWrapper;

import java.time.ZonedDateTime;
import java.util.Map;

public class GuideFairInviteModel extends RequestBase{
    private String guide_id; // which guide to invite
    private String fair_id; // which fair to invite the guide to

    public static GuideFairInviteModel fromMap(Map<String, Object> map) {
        // have to do this casting because setrequested_at returns a base class instance
        return (GuideFairInviteModel) new GuideFairInviteModel()
                .setGuide_id((String) map.get("guide_id"))
                .setFair_id((String) map.get("fair_id"))
                .setRequested_at(new DateWrapper(ZonedDateTime.parse((String) map.get("requested_at"))));
    }

    public String getGuide_id() {
        return guide_id;
    }

    public GuideFairInviteModel setGuide_id(String guide_id) {
        this.guide_id = guide_id;
        return this;
    }

    public String getFair_id() {
        return fair_id;
    }

    public GuideFairInviteModel setFair_id(String fair_id) {
        this.fair_id = fair_id;
        return this;
    }
}
