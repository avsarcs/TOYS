package models.data.tours;

import enums.roles.TOUR_APPLICANT_ROLE;
import models.Patterns;

public class TourApplicantModel {
    private String name;
    private TOUR_APPLICANT_ROLE role;
    private String email;
    private String phone;
    private String notes;

    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && name != null && !name.isEmpty();
            valid = valid && role != null;
            valid = valid && email != null && !email.isEmpty();
            valid = valid && Patterns.EMAIL.matcher(email).matches();

            valid = valid && phone != null && !phone.isEmpty();
            valid = valid && Patterns.PHONE_NUMBER.matcher(phone).matches();
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public String getName() {
        return name;
    }

    public TourApplicantModel setName(String name) {
        this.name = name;
        return this;
    }

    public TOUR_APPLICANT_ROLE getRole() {
        return role;
    }

    public TourApplicantModel setRole(TOUR_APPLICANT_ROLE role) {
        this.role = role;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public TourApplicantModel setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public TourApplicantModel setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public TourApplicantModel setNotes(String notes) {
        this.notes = notes;
        return this;
    }
}