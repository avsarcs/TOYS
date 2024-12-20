package server.models.requests;

import server.models.people.details.ContactInfo;

import java.util.Map;

public class Requester {
    private ContactInfo contactInfo;
    private String bilkent_id;

    public Requester() {}

    protected Requester(Map<String, Object> map) {
        this.contactInfo = ContactInfo.fromMap((Map<String, Object>) map.get("contactInfo"));
        this.bilkent_id = (String) map.get("bilkent_id");
    }

    static public Requester fromMap(Map<String, Object> map) {
        return new Requester(map);
    }

    public ContactInfo getContactInfo() {
        return contactInfo;
    }

    public Requester setContactInfo(ContactInfo contactInfo) {
        this.contactInfo = contactInfo;
        return this;
    }

    public String getBilkent_id() {
        return bilkent_id;
    }

    public Requester setBilkent_id(String bilkent_id) {
        this.bilkent_id = bilkent_id;
        return this;
    }
}
