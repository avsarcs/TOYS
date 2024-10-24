package apply.fair;

import models.DateWrapper;
import models.data.fairs.FairInvitationModel;
import models.data.tours.TourApplicantModel;

import java.time.ZonedDateTime;
import java.util.Map;

public class FairApplicationModel {
    private String highschool_id;
    private DateWrapper start_time;
    private DateWrapper end_time;

    private TourApplicantModel applicant;
    private String fair_name;
    private String notes;

    public String getHighschool_id() {
        return highschool_id;
    }

    public boolean isValid() {
        boolean validity = highschool_id != null;
        //TODO: When we have access to highschools, this needs to be checked to see if the highschool id is an actual id
        validity = validity && start_time != null && end_time != null;
        if (validity) {
            validity = end_time.getDate().isAfter(start_time.getDate()) && validity;
        }
        validity = validity && applicant != null;
        if (validity) {
            validity = applicant.isValid();
        }
        validity =  validity && fair_name != null;
        if (validity) {
            validity = validity && !fair_name.isEmpty();
        }
        return validity;
    }

    public FairApplicationModel setHighschool_id(String highschool_id) {
        this.highschool_id = highschool_id;
        return this;
    }

    public ZonedDateTime getStart_time() {
        return start_time.getDate();
    }

    public FairApplicationModel setStart_time(ZonedDateTime start_time) {
        this.start_time = new DateWrapper(start_time);
        return this;
    }

    public ZonedDateTime getEnd_time() {
        return end_time.getDate();
    }

    public FairApplicationModel setEnd_time(ZonedDateTime end_time) {
        this.end_time = new DateWrapper(end_time);
        return this;
    }

    public TourApplicantModel getApplicant() {
        return applicant;
    }

    public FairApplicationModel setApplicant(TourApplicantModel applicant) {
        this.applicant = applicant;
        return this;
    }

    public String getFair_name() {
        return fair_name;
    }

    public FairApplicationModel setFair_name(String fair_name) {
        this.fair_name = fair_name;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public FairApplicationModel setNotes(String notes) {
        this.notes = notes;
        return this;
    }
}
