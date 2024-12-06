package server.models.people;

import server.enums.*;
import server.enums.roles.USER_ROLE;
import server.models.DTO.DTO_Guide;
import server.models.Experience;
import server.models.GuideApplication;
import server.models.people.details.*;

import java.util.Map;

public class Guide extends User {
    private String high_school;
    private Department department;

    private Experience experience;


    public static Guide getDefault() {
        Guide guide = new Guide();
        guide.setBilkent_id("000000");
        guide.setProfile(new Profile()
                .setName("John Constantine")
                .setContact_info(new ContactInfo()
                        .setEmail("specialplace@hell.com")
                        .setPhone("666")
                        .setAddress("1st Street, Hell")
                )
                .setMajor(Department.MANAGEMENT)
                .setHighschool_id("Columbine High School")
                .setSemester(2)
                .setProfile_description("Hobbyist exorcist, demonologist, and master of the dark arts. I'm also a chain smoker.")
                .setProfile_picture("Profile pic b64")
                .setPayment_info(new PaymentInfo().setIban("0"))
                .setSchedule(new Schedule())
        );
        guide.setDepartment(Department.MANAGEMENT);
        guide.setExperience(Experience.getDefault());

        guide.setRole(USER_ROLE.GUIDE);
        guide.setHigh_school("Columbine High School");
        guide.setAuthInfo(new AuthInfo().setPassword("batman"));
        guide.setStatus(UserStatus.ACTIVE);
        GuideApplication guideApplication = new GuideApplication();
        guideApplication.setProfile(guide.getProfile());
        guideApplication.setBilkent_id(guide.getBilkent_id());
        guideApplication.setType(ApplicationType.GUIDE);
        guideApplication.setStatus(ApplicationStatus.APPROVED);
        guideApplication.setApplicationReason("Reasoning");
        guideApplication.setFutureExchange(false);
        guideApplication.setHeardFrom("the voices inside my head");

        guide.setApplication(guideApplication);
        return guide;
    }

    public Guide() {

    }

    public Guide modifyWithDTO(DTO_Guide dto) {
        this.setBilkent_id(dto.getId());

        profile.setName(dto.getFullname());
        profile.getContact_info().setPhone(dto.getPhone());
        profile.setHighschool_id(dto.getHigh_school().getId());
        profile.setMajor(dto.getMajor());
        profile.setProfile_picture(dto.getProfile_picture());

        profile.setProfile_description(dto.getProfile_description());
        this.setRole(dto.getRole());

        experience.setPrevious_events(dto.getAttended_events());

        return this;
    }
    protected Guide(Map<String, Object> map) {
        super(map);
        this.high_school = (String) map.get("high_school");
        this.department = Department.valueOf((String) map.get("department"));
        this.experience = Experience.fromMap((Map<String, Object>) map.get("experience"));
    }

    public static Guide fromMap(Map<String, Object> map) {
        return new Guide(map);
    }

    public String getHigh_school() {
        return high_school;
    }

    public Guide setHigh_school(String high_school) {
        this.high_school = high_school;
        return this;
    }

    public Department getDepartment() {
        return department;
    }

    public Guide setDepartment(Department department) {
        this.department = department;
        return this;
    }

    public Experience getExperience() {
        return experience;
    }

    public Guide setExperience(Experience experience) {
        this.experience = experience;
        return this;
    }
}
