package server.models.DTO;

import server.enums.Department;
import server.enums.roles.UserRole;
import server.models.people.Guide;

import java.util.List;
import java.util.Map;

public class DTO_Guide {
    private String id;
    private String fullname;
    private String phone;
    private DTO_Highschool high_school;
    private Department major;
    private UserRole role;
    private String profile_picture;
    private long previous_tour_count;
    private String profile_description;
    private boolean advisor_application_status;
    private List<String> attended_events;


    public static DTO_Guide fromGuide(Guide guide) {
        DTO_Guide dto = new DTO_Guide();
        dto.setId(guide.getBilkent_id());
        dto.setFullname(guide.getProfile().getName());
        dto.setPhone(guide.getProfile().getContact_info().getPhone());
        dto.setHigh_school(new DTO_Highschool(guide.getHigh_school()));
        dto.setMajor(guide.getDepartment());
        dto.setRole(guide.getRole());
        dto.setProfile_picture(guide.getProfile().getProfile_picture());
        dto.setPrevious_tour_count(guide.getExperience().getPrevious_events().size());
        dto.setProfile_description(guide.getProfile().getProfile_description());
        dto.setAdvisor_application_status(false); // TODO wtf is this
        dto.setAttended_events(guide.getExperience().getPrevious_events());
        return dto;
    }

    public DTO_Guide() {
    }
    protected DTO_Guide(Map<String, Object> map) {
        this.id = (String) map.get("id");
        this.fullname = (String) map.get("fullname");
        this.phone = (String) map.get("phone");
        this.high_school = DTO_Highschool.fromMap((Map<String, Object>) map.get("high_school"));
        this.major = Department.valueOf((String) map.get("major"));
        this.role = UserRole.valueOf((String) map.get("role"));
        this.profile_picture = (String) map.get("profile_picture");
        this.previous_tour_count = (long) map.get("previous_tour_count");
        this.profile_description = (String) map.get("profile_description");
        this.advisor_application_status = (boolean) map.get("advisor_application_status");
        this.attended_events = (List<String>) map.get("attended_events");
    }

    public static DTO_Guide fromMap(Map<String,Object> map) {
        return new DTO_Guide(map);
    }

    public String getId() {
        return id;
    }

    public DTO_Guide setId(String id) {
        this.id = id;
        return this;
    }

    public String getFullname() {
        return fullname;
    }

    public DTO_Guide setFullname(String fullname) {
        this.fullname = fullname;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public DTO_Guide setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public DTO_Highschool getHigh_school() {
        return high_school;
    }

    public DTO_Guide setHigh_school(DTO_Highschool high_school) {
        this.high_school = high_school;
        return this;
    }

    public Department getMajor() {
        return major;
    }

    public DTO_Guide setMajor(Department major) {
        this.major = major;
        return this;
    }

    public UserRole getRole() {
        return role;
    }

    public DTO_Guide setRole(UserRole role) {
        this.role = role;
        return this;
    }

    public String getProfile_picture() {
        return profile_picture;
    }

    public DTO_Guide setProfile_picture(String profile_picture) {
        this.profile_picture = profile_picture;
        return this;
    }

    public long getPrevious_tour_count() {
        return previous_tour_count;
    }

    public DTO_Guide setPrevious_tour_count(long previous_tour_count) {
        this.previous_tour_count = previous_tour_count;
        return this;
    }

    public String getProfile_description() {
        return profile_description;
    }

    public DTO_Guide setProfile_description(String profile_description) {
        this.profile_description = profile_description;
        return this;
    }

    public boolean isAdvisor_application_status() {
        return advisor_application_status;
    }

    public DTO_Guide setAdvisor_application_status(boolean advisor_application_status) {
        this.advisor_application_status = advisor_application_status;
        return this;
    }

    public List<String> getAttended_events() {
        return attended_events;
    }

    public DTO_Guide setAttended_events(List<String> attended_events) {
        this.attended_events = attended_events;
        return this;
    }
}
