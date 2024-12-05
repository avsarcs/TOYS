package server.models.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.enums.Department;
import server.models.TourApplication;
import server.models.time.ZTime;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class DTO_IndividualTourApplication {
    @JsonIgnore
    public boolean equals(DTO_IndividualTourApplication other) {
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

    public static DTO_IndividualTourApplication fromApplication(TourApplication application) {
        DTO_IndividualTourApplication dto = new DTO_IndividualTourApplication();
        dto.setApplicant(DTO_Applicant.fromApplicant(application.getApplicant()));
        dto.setHighschool(new DTO_Highschool(application.getApplicant().getSchool()));
        dto.setVisitor_count(application.getExpected_souls());

        dto.setNotes(application.getNotes());
        dto.setRequested_times(application.getRequested_hours());
        dto.setMajors(application.getInterested_in());
        return dto;
    }

    public static DTO_IndividualTourApplication getDefault() {
        DTO_IndividualTourApplication dto = new DTO_IndividualTourApplication();
        dto.setApplicant(DTO_Applicant.getDefault());
        dto.setHighschool(DTO_Highschool.getDefault());
        dto.setNotes("Default Notes");
        List<ZTime> times = new ArrayList<>();
        times.add(new ZTime(ZonedDateTime.ofInstant(Instant.EPOCH, ZoneId.of("UTC"))));
        dto.setRequested_times(times);
        dto.setVisitor_count(5);
        dto.setMajors(new ArrayList<>());
        dto.getMajors().add(Department.MANAGEMENT);
        return dto;
    }

    private DTO_Highschool highschool;
    private List<ZTime> requested_times;
    private long visitor_count;
    private DTO_Applicant applicant;
    private List<Department> majors;
    private String notes;

    public List<Department> getMajors() {
        return majors;
    }

    public List<ZTime> getRequested_times() {
        return requested_times;
    }

    public DTO_IndividualTourApplication setRequested_times(List<ZTime> requested_times) {
        this.requested_times = requested_times;
        return this;
    }

    public DTO_IndividualTourApplication setMajors(List<Department> majors) {
        this.majors = majors;
        return this;
    }

    public DTO_Highschool getHighschool() {
        return highschool;
    }

    public DTO_IndividualTourApplication setHighschool(DTO_Highschool highschool) {
        this.highschool = highschool;
        return this;
    }


    public long getVisitor_count() {
        return visitor_count;
    }

    public DTO_IndividualTourApplication setVisitor_count(long visitor_count) {
        this.visitor_count = visitor_count;
        return this;
    }

    public DTO_Applicant getApplicant() {
        return applicant;
    }

    public DTO_IndividualTourApplication setApplicant(DTO_Applicant applicant) {
        this.applicant = applicant;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public DTO_IndividualTourApplication setNotes(String notes) {
        this.notes = notes;
        return this;
    }
}
