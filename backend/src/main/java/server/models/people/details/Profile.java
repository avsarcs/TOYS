package server.models.people.details;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.enums.Department;
import server.models.DTO.DTO_GuideApplication;

import java.util.Map;

public class Profile {
    private String name;
    private String profile_picture;
    private String profile_description;
    private String highschool_id;
    private Department major;
    private long semester;

    private ContactInfo contact_info;
    private PaymentInfo payment_info;

    private Schedule schedule;

    public static Profile fromDTO_GuideApplication(DTO_GuideApplication dto) {
        Profile profile = new Profile();
        profile.setName(dto.getFull_name());
        profile.setContact_info(new ContactInfo()
                .setEmail(dto.getEmail())
                .setPhone(dto.getPhone())
                .setAddress("-")
        );
        profile.setProfile_description(dto.getWhyapply());
        profile.setProfile_picture("");
        profile.setMajor(dto.getMajor());
        profile.setSemester(dto.getCurrent_semester());
        profile.setPayment_info(new PaymentInfo()
                .setIban(PaymentInfo.getDefault().getIban())
        );
        profile.setHighschool_id(dto.getHigh_school().getId());
        profile.setSchedule(Schedule.getDefault());
        return profile;
    }

    public static Profile getDefault() {
        Profile profile =  new Profile()
                .setName("John Doe")
                .setProfile_picture("https://www.google.com")
                .setProfile_description("I am a student")
                .setContact_info(ContactInfo.getDefault())
                .setPayment_info(PaymentInfo.getDefault())
                .setSchedule(Schedule.getDefault())
                .setMajor(Department.MANAGEMENT)
                .setSemester(1)
                .setHighschool_id("123456");
        return profile;
    }

    public static Profile fromMap(Map<String, Object> map) {
        System.out.println(map.toString());
        return new Profile()
                .setHighschool_id((String) map.get("highschool_id"))
                .setMajor(Department.valueOf((String) map.get("major")))
                .setSemester((long) map.get("semester"))
            .setName((String) map.get("name"))
            .setProfile_picture((String) map.get("profile_picture"))
            .setProfile_description((String) map.get("profile_description"))
            .setContact_info(ContactInfo.fromMap((Map<String, Object>) map.get("contact_info")))
            .setPayment_info(PaymentInfo.fromMap((Map<String, Object>) map.get("payment_info")))
            .setSchedule(Schedule.fromMap((Map<String, Object>) map.get("schedule"))
                    );
    }

    @JsonIgnore
    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && name != null && !name.isEmpty();
            valid = valid && profile_picture != null;// && !profile_picture.isEmpty(); it can be empty
            valid = valid && profile_description != null && !profile_description.isEmpty();
            valid = valid && contact_info.isValid();
            valid = valid && payment_info.isValid();
            valid = valid && schedule.isValid();
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }


    public long getSemester() {
        return semester;
    }

    public Profile setSemester(long semester) {
        this.semester = semester;
        return this;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public Profile setSchedule(Schedule schedule) {
        this.schedule = schedule;
        return this;
    }

    public String getName() {
        return name;
    }

    public Profile setName(String name) {
        this.name = name;
        return this;
    }

    public String getProfile_picture() {
        return profile_picture;
    }

    public Profile setProfile_picture(String profile_picture) {
        this.profile_picture = profile_picture;
        return this;
    }

    public Department getMajor() {
        return major;
    }

    public Profile setMajor(Department major) {
        this.major = major;
        return this;
    }

    public String getProfile_description() {
        return profile_description;
    }

    public Profile setProfile_description(String profile_description) {
        this.profile_description = profile_description;
        return this;
    }

    public ContactInfo getContact_info() {
        return contact_info;
    }

    public Profile setContact_info(ContactInfo contact_info) {
        this.contact_info = contact_info;
        return this;
    }

    public PaymentInfo getPayment_info() {
        return payment_info;
    }

    public Profile setPayment_info(PaymentInfo payment_info) {
        this.payment_info = payment_info;
        return this;
    }

    public String getHighschool_id() {
        return highschool_id;
    }

    public Profile setHighschool_id(String highschool_id) {
        this.highschool_id = highschool_id;
        return this;
    }
}
