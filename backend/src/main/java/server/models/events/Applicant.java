package server.models.events;

import server.enums.roles.ApplicantRole;
import server.models.DTO.DTO_Applicant;
import server.models.people.details.ContactInfo;

import java.util.Map;

public class Applicant {

    public Applicant() {

    }

    protected Applicant(Map<String, Object> map) {
        this.name = (String) map.get("name");
        this.contact_info = ContactInfo.fromMap((Map<String, Object>) map.get("contact_info"));
        this.role = ApplicantRole.valueOf((String) map.get("role"));
        this.school = (String) map.get("school");
        this.notes = (String) map.get("notes");
    }

    public static Applicant getDefault() {
        return new Applicant()
                .setName("Default Name")
                .setContact_info(ContactInfo.getDefault())
                .setRole(ApplicantRole.STUDENT)
                .setSchool("Default School")
                .setNotes("Default Notes");
    }

    public static Applicant fromMap(Map<String, Object> map) {
        return new Applicant(map);
    }
    public static Applicant fromDTO(DTO_Applicant dto, String school) {
        Applicant applicant = new Applicant();

        applicant.setName(dto.getFullname());
        applicant.setSchool(school);
        applicant.setContact_info(
                new ContactInfo()
                        .setEmail(dto.getEmail())
                        .setPhone(dto.getPhone())
                        .setAddress(".")
        );
        applicant.setRole(ApplicantRole.valueOf(dto.getRole().toUpperCase()));
        applicant.setNotes(dto.getNotes());

        return applicant;
    }

    private String name;
    private ContactInfo contact_info;
    private ApplicantRole role;
    private String school;
    private String notes;

    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && name != null && !name.isEmpty();
            valid = valid && contact_info != null && contact_info.isValid();
            valid = valid && role != null;
            valid = valid && school != null && !school.isEmpty();
            valid = valid && notes != null;
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public String getNotes() {
        return notes;
    }

    public Applicant setNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public String getName() {
        return name;
    }

    public Applicant setName(String name) {
        this.name = name;
        return this;
    }

    public ContactInfo getContact_info() {
        return contact_info;
    }

    public Applicant setContact_info(ContactInfo contact_info) {
        this.contact_info = contact_info;
        return this;
    }

    public ApplicantRole getRole() {
        return role;
    }

    public Applicant setRole(ApplicantRole role) {
        this.role = role;
        return this;
    }

    public String getSchool() {
        return school;
    }

    public Applicant setSchool(String school) {
        this.school = school;
        return this;
    }
}
