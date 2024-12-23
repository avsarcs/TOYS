package server.models.people;

import server.enums.*;
import server.enums.roles.UserRole;
import server.enums.status.ApplicationStatus;
import server.enums.status.UserStatus;
import server.enums.types.ApplicationType;
import server.models.Experience;
import server.models.payment.FiscalState;
import server.models.people.details.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class Guide extends User {
    private String high_school;

    private Experience experience;

    public Guide(Guide other) {
        super(other);
        this.high_school = other.high_school;
        this.experience = new Experience(other.experience);
    }

    static public Guide nonnull() {
        Guide guide = new Guide(User.nonnull());
        guide.setHigh_school("");
        guide.setExperience(Experience.nonnull());
        return guide;
    }

    public Guide(User user) {
        super(user);
    }

    public static Guide fromApplication(GuideApplication application) {
        Guide guide = new Guide();
        guide.setBilkent_id(application.getBilkent_id());
        guide.setProfile(application.getProfile());
        guide.setFiscalState(new FiscalState(0, 0, List.of()));
        guide.setExperience(new Experience().setExperienceLevel_level(ExperienceLevel.TRAINEE).setPrevious_events(List.of()));

        guide.setRole(UserRole.GUIDE);
        guide.setHigh_school(application.getProfile().getHighschool_id());
        guide.setAuthInfo(new AuthInfo().setPassword(UUID.randomUUID().toString()));
        guide.setStatus(UserStatus.ACTIVE);
        guide.setApplication(application);
        return guide;
    }


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
                .setHighschool_id("Default HS ID")
                .setSemester(2)
                .setProfile_description("Hobbyist exorcist, demonologist, and master of the dark arts. I'm also a chain smoker.")
                .setProfile_picture("Profile pic b64")
                .setPayment_info(new PaymentInfo().setIban("0"))
                .setSchedule(new Schedule())
        );
        guide.setFiscalState(new FiscalState(0, 0, List.of()));
        guide.setExperience(Experience.getDefault());

        guide.setRole(UserRole.GUIDE);
        guide.setHigh_school("Default HS ID");
        guide.setAuthInfo(new AuthInfo().setPassword("password"));
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

    public Guide modifyWithDTO(Map<String, Object> dto) {
        //this.setBilkent_id((String) dto.get("id"));x

        profile.setName((String) dto.get("fullname"));
        profile.getContact_info().setPhone((String) dto.get("phone"));
        profile.getContact_info().setEmail((String) dto.get("email"));
        profile.setHighschool_id((String) ((Map<String, Object>) dto.get("highschool")).get("id"));
        profile.setSchedule(Schedule.fromMap((Map<String, Object>) dto.get("schedule")));
        profile.getPayment_info().setIban((String) dto.get("iban"));
        profile.setMajor(Department.valueOf((String) dto.get("major")));


        profile.setProfile_description((String) dto.get("profile_description"));
        profile.setProfile_picture((String) dto.get("profile_picture"));

        String requestedRole = (String) dto.get("role");

        if (requestedRole.equals("TRAINEE")) {
            this.setRole(UserRole.GUIDE);
            this.experience.setExperienceLevel_level(ExperienceLevel.TRAINEE);

        } else if (requestedRole.equals("GUIDE")) {
            this.setRole(UserRole.GUIDE);
            this.experience.setExperienceLevel_level(ExperienceLevel.JUNIOR);

        } else if (requestedRole.equals("ADVISOR")) {
            this.setRole(UserRole.ADVISOR);
            this.experience.setExperienceLevel_level(ExperienceLevel.SENIOR);
        }
        
        return this;
    }
    protected Guide(Map<String, Object> map) {
        super(map);
        this.high_school = (String) map.get("high_school");
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

    public Experience getExperience() {
        return experience;
    }

    public Guide setExperience(Experience experience) {
        this.experience = experience;
        return this;
    }
}
