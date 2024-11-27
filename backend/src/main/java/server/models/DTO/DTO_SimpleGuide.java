package server.models.DTO;

import server.enums.Department;
import server.models.people.Guide;

public class DTO_SimpleGuide {
    private String id;
    private String name;
    private Department major;
    private String experience;

    public static DTO_SimpleGuide fromGuide(Guide guide) {
        DTO_SimpleGuide dto = new DTO_SimpleGuide();

        dto.setId(guide.getBilkent_id());
        dto.setName(guide.getProfile().getName());

        dto.setMajor(guide.getDepartment());

        dto.setExperience(guide.getExperience().getPrevious_events().size() + " events");

        return dto;
    }

    public String getId() {
        return id;
    }

    public DTO_SimpleGuide setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public DTO_SimpleGuide setName(String name) {
        this.name = name;
        return this;
    }

    public Department getMajor() {
        return major;
    }

    public DTO_SimpleGuide setMajor(Department major) {
        this.major = major;
        return this;
    }

    public String getExperience() {
        return experience;
    }

    public DTO_SimpleGuide setExperience(String experience) {
        this.experience = experience;
        return this;
    }
}
