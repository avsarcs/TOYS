package apply.tour;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import enums.types.TOUR_TYPE;
import models.DateWrapper;
import models.data.tours.TourApplicantModel;

import java.time.ZonedDateTime;
import java.util.List;

public class TourApplicationModel {
    private TOUR_TYPE type;
    private int visitor_count;
    private String highschool_id;

    private TourApplicantModel applicant;
    private List<DateWrapper> requested_dates;

    private String notes;

    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && type != null;
            valid = valid && visitor_count > 0;
            valid = valid && highschool_id != null && !highschool_id.isEmpty();
            valid = valid && applicant != null && applicant.isValid();
            valid = valid && requested_dates != null && !requested_dates.isEmpty();

        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public TOUR_TYPE getType() {
        return type;
    }

    public TourApplicationModel setType(TOUR_TYPE type) {
        this.type = type;
        return this;
    }

    public int getVisitor_count() {
        return visitor_count;
    }

    public TourApplicationModel setVisitor_count(int visitor_count) {
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