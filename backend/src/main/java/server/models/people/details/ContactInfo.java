package server.models.people.details;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.Patterns;

import java.util.Map;

public class ContactInfo {
    private String email, phone, address;

    public Map<String, Object> asMap() {
        return Map.of(
                "email", email,
                "phone", phone,
                "address", address
        );
    }

    public static ContactInfo nonnull() {
        return new ContactInfo().setEmail("").setAddress("").setPhone("");
    }

    public ContactInfo() {
    }

    public ContactInfo(ContactInfo other) {
        this.email = other.getEmail();
        this.phone = other.getPhone();
        this.address = other.getAddress();
    }

    public static ContactInfo getDefault() {
        return new ContactInfo()
            .setEmail("default@email.com")
                .setAddress("default address")
                .setPhone("555 555 55 55");
    }

    public static ContactInfo fromMap(Map<String, Object> map) {
        return new ContactInfo()
            .setEmail((String) map.get("email"))
            .setPhone((String) map.get("phone"))
            .setAddress((String) map.get("address"));
    }
    @JsonIgnore
    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && email != null && !email.isEmpty();
            valid = valid && email.toLowerCase().matches(Patterns.EMAIL.pattern());
            valid = valid && phone != null && !phone.isEmpty();
            valid = valid && phone.matches(Patterns.PHONE_NUMBER.pattern());
            valid = valid && address != null && !address.isEmpty();
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public String getEmail() {
        return email;
    }

    public ContactInfo setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public ContactInfo setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public ContactInfo setAddress(String address) {
        this.address = address;
        return this;
    }
}
