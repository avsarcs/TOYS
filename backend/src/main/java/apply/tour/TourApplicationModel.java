package apply.tour;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import enums.DEPARTMENT;
import enums.types.TOUR_TYPE;
import models.DateWrapper;
import models.data.tours.TourApplicantModel;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

public class TourApplicationModel {
    private TOUR_TYPE type;
    private long visitor_count;
    private String highschool_id;

    private TourApplicantModel applicant;
    private List<DateWrapper> requested_dates;

    private String notes;

    private List<DEPARTMENT> requested_departments;

    public static TourApplicationModel fromMap(Map<String, Object> map) {
        TourApplicationModel application = new TourApplicationModel()
                .setType(TOUR_TYPE.valueOf((String) map.get("type")))
                .setVisitor_count((long) map.get("visitor_count"))
                .setHighschool_id((String) map.get("highschool_id"))
                .setApplicant(TourApplicantModel.fromMap((Map<String, Object>) map.get("applicant")))
                .setRequested_dates(((List<String>) map.get("requested_dates")).stream().map(ZonedDateTime::parse).toList())
                .setNotes((String) map.get("notes"));

        if (map.get("requested_departments") != null) {
            application.setRequested_departments((List<DEPARTMENT>) map.get("requested_departments"));
        }
        return application;
    }

    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && type != null;
            valid = valid && visitor_count > 0;
            valid = valid && highschool_id != null && !highschool_id.isEmpty();
            valid = valid && applicant != null && applicant.isValid();
            valid = valid && requested_dates != null && !requested_dates.isEmpty();

            if (type == TOUR_TYPE.INDIVIDUAL) {
                valid = valid && requested_departments != null && !requested_departments.isEmpty();
            }

        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }


    public List<DEPARTMENT> getRequested_departments() {
        return requested_departments;
    }

    public TourApplicationModel setRequested_departments(List<DEPARTMENT> requested_departments) {
        this.requested_departments = requested_departments;
        return this;
    }

    public TOUR_TYPE getType() {
        return type;
    }

    public TourApplicationModel setType(TOUR_TYPE type) {
        this.type = type;
        return this;
    }

    public long getVisitor_count() {
        return visitor_count;
    }

    public TourApplicationModel setVisitor_count(long visitor_count) {
        this.visitor_count = visitor_count;
        return this;
    }

    public String getHighschool_id() {
        return highschool_id;
    }

    public TourApplicationModel setHighschool_id(String highschool_id) {
        this.highschool_id = highschool_id;
        return this;
    }

    public TourApplicantModel getApplicant() {
        return applicant;
    }

    public TourApplicationModel setApplicant(TourApplicantModel applicant) {
        this.applicant = applicant;
        return this;
    }

    public List<ZonedDateTime> getRequested_dates() {
        return requested_dates.stream().map(DateWrapper::getDate).toList();
    }

    public TourApplicationModel setRequested_dates(List<ZonedDateTime> requested_dates) {
        this.requested_dates = requested_dates.stream().map(DateWrapper::new).toList();
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public TourApplicationModel setNotes(String notes) {
        this.notes = notes;
        return this;
    }
}