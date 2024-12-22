package server.models.requests;

import java.util.Map;

public class GuideAssignmentRequest extends Request {
    private String event_id;
    private String guide_id;

    public GuideAssignmentRequest() {
        super();
    }

    protected GuideAssignmentRequest(Map<String, Object> map) {
        super(map);
        this.event_id = (String) map.get("event_id");
        this.guide_id = (String) map.get("guide_id");
    }

    static public GuideAssignmentRequest fromMap(Map<String, Object> map) {
        return new GuideAssignmentRequest(map);
    }

    public String getEvent_id() {
        return event_id;
    }

    public GuideAssignmentRequest setEvent_id(String event_id) {
        this.event_id = event_id;
        return this;
    }

    public String getGuide_id() {
        return guide_id;
    }

    public GuideAssignmentRequest setGuide_id(String guide_id) {
        this.guide_id = guide_id;
        return this;
    }
}
