package server.models.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.events.Applicant;

public class DTO_Applicant {
    private String fullname;
    private String role;
    private String email;
    private String phone;
    private String notes;

    public static DTO_Applicant getDefault() {
        DTO_Applicant dto = new DTO_Applicant();
        dto.setFullname("John Doe");
        dto.setRole("teacher");
        dto.setEmail("default@email.com");
        dto.setPhone("555 555 55 55");
        dto.setNotes("Default Notes");
        return dto;
    }

    @JsonIgnore
    public boolean equals(DTO_Applicant other) {
        boolean equal = true;
        equal = equal && this.fullname.equals(other.fullname);
        equal = equal && this.role.equals(other.role);
        equal = equal && this.email.equals(other.email);
        equal = equal && this.phone.equals(other.phone);
        equal = equal && this.notes.equals(other.notes);

        return equal;
    }

    public static DTO_Applicant fromApplicant(Applicant applicant) {
        return new DTO_Applicant()
            .setFullname(applicant.getName())
            .setRole(applicant.getRole().name().toLowerCase())
            .setEmail(applicant.getContact_info().getEmail())
            .setPhone(applicant.getContact_info().getPhone())
            .setNotes(applicant.getNotes());
    }

    public String getFullname() {
        return fullname;
    }

    public DTO_Applicant setFullname(String fullname) {
        this.fullname = fullname;
        return this;
    }

    public String getRole() {
        return role;
    }

    public DTO_Applicant setRole(String role) {
        this.role = role;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public DTO_Applicant setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public DTO_Applicant setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public DTO_Applicant setNotes(String notes) {
        this.notes = notes;
        return this;
    }
}
