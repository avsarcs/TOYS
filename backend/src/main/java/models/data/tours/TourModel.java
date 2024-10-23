package models.data.tours;

import apply.tour.TourApplicationModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import enums.status.TOUR_STATUS;
import enums.types.TOUR_TYPE;
import models.Assignable;
import models.data.guides.GuideModel;
import org.conscrypt.OpenSSLMessageDigestJDK;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;


/// All tours, regardless of their status (for example: still just a request) are kept as a record in the database as a TourModel.
public class TourModel extends Assignable {
    private String id; // this is an internal identifier, to be used for data manipulation
    private TOUR_STATUS status;
    private long visitor_count;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime accepted_date;

    private String assigned_location;
    private String notes;

    private List<GuideModel> assigned_guides;
    private TourApplicationModel application;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime requested_date;

    public static TourModel fromMap(Map<String, Object> map) {
        TourModel tour = new TourModel()
                .setId((String) map.get("id"))
                .setStatus(TOUR_STATUS.valueOf((String) map.get("status")))
                .setVisitor_count((long) map.get("visitor_count"))
                .setNotes((String) map.get("notes"))
                .setRequested_date(ZonedDateTime.parse((String) map.get("requested_date")));

        if (map.get("accepted_date") != null) {
            tour.setAccepted_date(ZonedDateTime.parse((String) map.get("accepted_date")));
        }

        if (map.get("assigned_location") != null) {
            tour.setAssigned_location((String) map.get("assigned_location"));
        }
        return tour;
    }

    public static TourModel fromApplication(TourApplicationModel application) {
        return new TourModel()
                .setApplication(application)
                .setVisitor_count(application.getVisitor_count())
                .setStatus(TOUR_STATUS.AWAITING_CONFIRMATION)
                .setNotes(application.getNotes())
                .setRequested_date(ZonedDateTime.now())
                .setId();
    }



    public ZonedDateTime getRequested_date() {
        return requested_date;
    }

    public TourModel setRequested_date(ZonedDateTime requested_date) {
        this.requested_date = requested_date;
        return this;
    }

    public String getId() {
        return id;
    }

    public TourModel setId() {
        this.id = "tour_" + ZonedDateTime.now().toInstant().toEpochMilli();
        return this;
    }

    public TourModel setId(String id) {
        this.id = id;
        return this;
    }

    public TOUR_STATUS getStatus() {
        return status;
    }

    public TourModel setStatus(TOUR_STATUS status) {
        this.status = status;
        return this;
    }

    public long getVisitor_count() {
        return visitor_count;
    }

    public TourModel setVisitor_count(long visitor_count) {
        this.visitor_count = visitor_count;
        return this;
    }

    public ZonedDateTime getAccepted_date() {
        return accepted_date;
    }

    public TourModel setAccepted_date(ZonedDateTime accepted_date) {
        this.accepted_date = accepted_date;
        return this;
    }

    public String getAssigned_location() {
        return assigned_location;
    }

    public TourModel setAssigned_location(String assigned_location) {
        this.assigned_location = assigned_location;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public TourModel setNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public List<GuideModel> getAssigned_guides() {
        return assigned_guides;
    }

    public TourModel setAssigned_guides(List<GuideModel> assigned_guides) {
        this.assigned_guides = assigned_guides;
        return this;
    }

    public TourApplicationModel getApplication() {
        return application;
    }

    public TourModel setApplication(TourApplicationModel application) {
        this.application = application;
        return this;
    }
}
