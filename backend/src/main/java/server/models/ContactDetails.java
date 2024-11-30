package server.models;

import java.util.Map;

public class ContactDetails {
    private String email;
    private String phone;

    public static ContactDetails fromMap(Map<String, Object> map) {
        return new ContactDetails()
                .setEmail((String) map.get("email"))
                .setPhone((String) map.get("phone"));
    }

    public String getEmail() {
        return email;
    }

    public ContactDetails setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public ContactDetails setPhone(String phone) {
        this.phone = phone;
        return this;
    }
}
