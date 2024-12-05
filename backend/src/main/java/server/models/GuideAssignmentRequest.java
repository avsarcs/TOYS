package server.models;

import server.enums.RequestStatus;
import server.enums.RequestType;
import server.models.people.Guide;
import server.models.people.details.ContactInfo;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
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

    public static GuideAssignmentRequest getDefault() {
        GuideAssignmentRequest gar = new GuideAssignmentRequest();

        gar.setRequest_id("gar_-1");
        gar.setRequested_by(ContactInfo.getDefault());
        gar.setType(RequestType.ASSIGNMENT);
        gar.setNotes("test notes");
        gar.setRequested_at(new ZTime(ZonedDateTime.now()));
        gar.setStatus(RequestStatus.PENDING);
        gar.setRequested_by(ContactInfo.getDefault());
        gar.setRequested_guide_id(Guide.getDefault().getBilkent_id());
        gar.setEvent_id(TourRegistry.getDefault().getTour_id());
        return gar;
    }

    public static GuideAssignmentRequest fromMap(Map<String, Object> map) {
        return new GuideAssignmentRequest(map);
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
