package apply.tour.request_changes;

import models.DateWrapper;
import models.data.tours.TourModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import respond.tours.AcceptDeny;

import java.time.ZonedDateTime;
import java.util.Map;

public class TourChangeRequestModel extends RequestBase{
    private String tour_id;
    private String message;
    private TourModel requestedChanges;

    public static TourChangeRequestModel fromMap(Map<String,Object> map) {
        return new TourChangeRequestModel()
                .setId((String) map.get("request_id"))
                .setTour_id((String) map.get("tour_id"))
                .setMessage((String) map.get("message"))
                .setRequestedChanges(TourModel.fromMap((Map<String, Object>) map.get("requestedChanges")))
                .setStatus(RequestStatus.valueOf((String) map.get("status")))
                .setRequested_at(new DateWrapper(ZonedDateTime.parse((String) map.get("requested_at"))));
    }



    public DateWrapper getRequested_at() {
        return requested_at;
    }

    public TourChangeRequestModel setRequested_at(DateWrapper requested_at) {
        this.requested_at = requested_at;
        return this;
    }

    public TourChangeRequestModel setStatus(RequestStatus status) {
        super.setStatus(status);
        return this;
    }

    public String getId() {
        return id;
    }

    public TourChangeRequestModel setId(String id) {
        this.id = id;
        return this;
    }

    public String getTour_id() {
        return tour_id;
    }

    public TourChangeRequestModel setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public TourChangeRequestModel setMessage(String message) {
        this.message = message;
        return this;
    }

    public TourModel getRequestedChanges() {
        return requestedChanges;
    }

    public TourChangeRequestModel setRequestedChanges(TourModel requestedChanges) {
        this.requestedChanges = requestedChanges;
        return this;
    }
}
