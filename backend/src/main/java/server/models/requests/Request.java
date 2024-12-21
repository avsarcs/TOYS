package server.models.requests;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import server.enums.status.RequestStatus;
import server.enums.types.RequestType;
import server.models.time.ZTime;

import java.util.Map;

@JsonSubTypes({
        @JsonSubTypes.Type(value = GuideAssignmentRequest.class, name = "GuideAssignmentRequest"),
        @JsonSubTypes.Type(value = TourModificationRequest.class, name = "TourModificationRequest")
})
public class Request {

    public Request() {
        request_id = "r_" + System.currentTimeMillis();
    }

    protected Request(Map<String,Object> map) {
        this.type = RequestType.valueOf((String) map.get("type"));
        this.status = RequestStatus.valueOf((String) map.get("status"));
        this.requested_at = new ZTime((String) map.get("requested_at"));
        this.notes = (String) map.get("notes");
        this.requested_by = Requester.fromMap((Map<String, Object>) map.get("requested_by"));
        this.request_id = (String) map.get("request_id");
    }


    public static Request fromMap(Map<String, Object> map) {
        return new Request(map);
    }

    public void generateID() {
        request_id = "r_" + System.currentTimeMillis();
    }


    private RequestType type;
    private RequestStatus status;
    private ZTime requested_at;
    private String notes;
    private Requester requested_by;
    private String request_id;

    public String getRequest_id() {
        return request_id;
    }

    public Request setRequest_id(String request_id) {
        this.request_id = request_id;
        return this;
    }

    public RequestType getType() {
        return type;
    }

    public Request setType(RequestType type) {
        this.type = type;
        return this;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public Request setStatus(RequestStatus status) {
        this.status = status;
        return this;
    }

    public ZTime getRequested_at() {
        return requested_at;
    }

    public Request setRequested_at(ZTime requested_at) {
        this.requested_at = requested_at;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public Request setNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public Requester getRequested_by() {
        return requested_by;
    }

    public Request setRequested_by(Requester requested_by) {
        this.requested_by = requested_by;
        return this;
    }
}
