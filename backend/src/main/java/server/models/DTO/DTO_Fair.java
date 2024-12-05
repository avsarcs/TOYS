package server.models.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.dbm.Database;
import server.enums.status.FAIR_STATUS;
import server.models.FairRegistry;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.ZonedDateTime;

public class DTO_Fair {
    private DTO_Applicant applicant;
    private ZonedDateTime start_time;
    private ZonedDateTime end_time;
    private String fair_name;
    private FAIR_STATUS status;
    private DTO_Highschool school;
    private String fair_id;

    public static DTO_Fair fromFair(FairRegistry fair) {
        DTO_Fair dto = new DTO_Fair();

        dto.setApplicant(DTO_Applicant.fromApplicant(fair.getApplicant()));
        dto.setStart_time(fair.getStarts_at().getDate());
        dto.setEnd_time(fair.getEnds_at().getDate());
        dto.setStatus(fair.getFair_status());
        dto.setFair_name(fair.getFair_name());
        dto.setSchool(new DTO_Highschool(fair.getApplicant().getSchool()));
        dto.setFair_id(fair.getFair_id());

        return dto;
    }


    public String getFair_id() {
        return fair_id;
    }

    public DTO_Fair setFair_id(String fair_id) {
        this.fair_id = fair_id;
        return this;
    }

    public DTO_Applicant getApplicant() {
        return applicant;
    }

    public DTO_Fair setApplicant(DTO_Applicant applicant) {
        this.applicant = applicant;
        return this;
    }

    public ZonedDateTime getStart_time() {
        return start_time;
    }

    public DTO_Fair setStart_time(ZonedDateTime start_time) {
        this.start_time = start_time;
        return this;
    }

    public ZonedDateTime getEnd_time() {
        return end_time;
    }

    public DTO_Fair setEnd_time(ZonedDateTime end_time) {
        this.end_time = end_time;
        return this;
    }

    public String getFair_name() {
        return fair_name;
    }

    public DTO_Fair setFair_name(String fair_name) {
        this.fair_name = fair_name;
        return this;
    }

    public FAIR_STATUS getStatus() {
        return status;
    }

    public DTO_Fair setStatus(FAIR_STATUS status) {
        this.status = status;
        return this;
    }

    public DTO_Highschool getSchool() {
        return school;
    }

    public DTO_Fair setSchool(DTO_Highschool school) {
        this.school = school;
        return this;
    }
}
