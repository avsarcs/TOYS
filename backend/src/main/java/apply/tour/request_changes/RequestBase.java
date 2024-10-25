package apply.tour.request_changes;

import models.DateWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import respond.tours.AcceptDeny;

abstract public class RequestBase {
    protected DateWrapper requested_at;
    protected String id;
    protected RequestStatus status;

    public void accept_reject(AcceptDeny response) {
        if (status != RequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request has already been responded to");
        }

        if (response == AcceptDeny.ACCEPT) {
            setStatus(RequestStatus.ACCEPTED);
        } else {
            setStatus(RequestStatus.REJECTED);
        }
    }

    public RequestStatus getStatus() {
        return status;
    }

    public RequestBase setStatus(RequestStatus status) {
        this.status = status;
        return this;
    }

    public String generateId() {
        id = "request_" + System.currentTimeMillis();
        return id;
    }
    public String getId() {
        return id;
    }

    public RequestBase setId(String id) {
        this.id = id;
        return this;
    }

    public DateWrapper getRequested_at() {
        return requested_at;
    }

    public RequestBase setRequested_at(DateWrapper requested_at) {
        this.requested_at = requested_at;
        return this;
    }
}
