package server.models.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.TourApplication;
import server.models.time.ZTime;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class DTO_GroupTourApplication {

    public static DTO_GroupTourApplication fromApplication(TourApplication application) {
        DTO_GroupTourApplication dto = new DTO_GroupTourApplication();
        dto.setApplicant(DTO_Applicant.fromApplicant(application.getApplicant()));
        dto.setHighschool(new DTO_Highschool(application.getApplicant().getSchool()));
        dto.setNotes(application.getNotes());
        dto.setVisitor_count(application.getExpected_souls());
        dto.setRequested_times(application.getRequested_hours());
        return dto;
    }

    @JsonIgnore
    public boolean isEqual(DTO_GroupTourApplication other) {
        boolean equal = true;
        equal = equal && this.applicant.equals(other.applicant);
        equal = equal && this.highschool.equals(other.highschool);
        equal = equal && this.notes.equals(other.notes);
        equal = equal && this.visitor_count == other.visitor_count;
        equal = equal && this.requested_times.size() == other.requested_times.size();
        for (int i = 0; i < this.requested_times.size(); i++) {
            equal = equal && this.requested_times.get(i).equals(other.requested_times.get(i));
        }

        return equal;
    }

    private DTO_Highschool highschool;
    private List<ZTime> requested_times;
    private long visitor_count;
    private String notes;
    private DTO_Applicant applicant;

    public static DTO_GroupTourApplication getDefault() {
        DTO_GroupTourApplication dto = new DTO_GroupTourApplication();
        dto.setApplicant(DTO_Applicant.getDefault());
        dto.setHighschool(DTO_Highschool.getDefault());
        dto.setNotes("Default Notes");
        ArrayList<ZTime> times = new ArrayList<>();
        times.add(new ZTime(ZonedDateTime.ofInstant(Instant.EPOCH, ZoneId.of("UTC"))));
        dto.setRequested_times(times);
        dto.setVisitor_count(100);
        return dto;
    }

    public DTO_Highschool getHighschool() {
        return highschool;
    }

    public DTO_GroupTourApplication setHighschool(DTO_Highschool highschool) {
        this.highschool = highschool;
        return this;
    }

    public List<ZTime> getRequested_times() {
        return requested_times;
    }

    public DTO_GroupTourApplication setRequested_times(List<ZTime> requested_times) {
        this.requested_times = requested_times;
        return this;
    }

    public long getVisitor_count() {
        return visitor_count;
    }

    public DTO_GroupTourApplication setVisitor_count(long visitor_count) {
        this.visitor_count = visitor_count;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public DTO_GroupTourApplication setNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public DTO_Applicant getApplicant() {
        return applicant;
    }

    public DTO_GroupTourApplication setApplicant(DTO_Applicant applicant) {
        this.applicant = applicant;
        return this;
    }
}
