package internal.user.profile;

import models.ContactDetails;
import models.data.guides.GUIDE_EXPERIENCE_LEVEL;

import java.util.Map;

public class ProfileModel {
    private String id;
    private String name;
    private String image_b64;

    private ContactDetails contactDetails;
    private String description;


    public static ProfileModel fromMap(Map<String, Object> map) {
        if (map.containsKey("responsibleFor")) {
            return AdvisorProfile.fromMap(map);
        } else {
            return GuideProfile.fromMap(map);
        }
    }

    public String getId() {
        return id;
    }

    public ProfileModel setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public ProfileModel setName(String name) {
        this.name = name;
        return this;
    }

    public String getImage_b64() {
        return image_b64;
    }

    public ProfileModel setImage_b64(String image_b64) {
        this.image_b64 = image_b64;
        return this;
    }

    public ContactDetails getContactDetails() {
        return contactDetails;
    }

    public ProfileModel setContactDetails(ContactDetails contactDetails) {
        this.contactDetails = contactDetails;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public ProfileModel setDescription(String description) {
        this.description = description;
        return this;
    }
}