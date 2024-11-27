package server.models;

import java.util.Map;

public class GuideAssignmentRequest extends Request{

    public GuideAssignmentRequest() {
        super();
    }
    protected GuideAssignmentRequest(Map<String, Object> map) {
        super(map);
        this.event_id = (String) map.get("event_id");
        this.requested_guide_id = (String) map.get("requested_guide_id");
    }

    private String event_id;
    private String requested_guide_id;

    public String getEvent_id() {
        return event_id;
    }

    public GuideAssignmentRequest setEvent_id(String event_id) {
        this.event_id = event_id;
        return this;
    }

    public String getRequested_guide_id() {
        return requested_guide_id;
    }

    public GuideAssignmentRequest setRequested_guide_id(String requested_guide_id) {
        this.requested_guide_id = requested_guide_id;
        return this;
    }
}
