package internal.user.profile;

import enums.DEPARTMENT;
import models.ContactDetails;
import models.data.guides.GUIDE_EXPERIENCE_LEVEL;

import java.util.Map;

public class GuideProfile extends ProfileModel{
    private String origin_highschool_id;
    private DEPARTMENT department;
    private GUIDE_EXPERIENCE_LEVEL experience_level;

    public static GuideProfile fromMap(Map<String, Object> map) {
        GuideProfile guide = new GuideProfile();
        guide.setId((String) map.get("id"));
        guide.setName((String) map.get("name"));
        guide.setImage_b64((String) map.get("image_b64"));
        guide.setContactDetails(ContactDetails.fromMap((Map<String, Object>) map.get("contactDetails")));
        guide.setDescription((String) map.get("description"));
        guide.setOrigin_highschool_id((String) map.get("origin_highschool_id"));
        guide.setDepartment(DEPARTMENT.valueOf((String) map.get("department")));
        guide.setExperience_level(GUIDE_EXPERIENCE_LEVEL.valueOf((String) map.get("experience_level")));
        return guide;
    }

    public String getOrigin_highschool_id() {
        return origin_highschool_id;
    }

    public GuideProfile setOrigin_highschool_id(String origin_highschool_id) {
        this.origin_highschool_id = origin_highschool_id;
        return this;
    }

    public DEPARTMENT getDepartment() {
        return department;
    }

    public GuideProfile setDepartment(DEPARTMENT department) {
        this.department = department;
        return this;
    }

    public GUIDE_EXPERIENCE_LEVEL getExperience_level() {
        return experience_level;
    }

    public GuideProfile setExperience_level(GUIDE_EXPERIENCE_LEVEL experience_level) {
        this.experience_level = experience_level;
        return this;
    }
}
