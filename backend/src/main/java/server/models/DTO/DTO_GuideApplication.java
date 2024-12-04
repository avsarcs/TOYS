package server.models.DTO;

import server.enums.Department;
import server.models.GuideApplication;

public class DTO_GuideApplication {
    private String full_name;
    private String id;
    private DTO_Highschool high_school;
    private String email;
    private String phone;
    private Department major;
    private long current_semester;
    private boolean next_semester_exchange;
    private String howdidyouhear;
    private String whyapply;

    public static DTO_GuideApplication getDefault() {
        DTO_GuideApplication application = new DTO_GuideApplication();

        application.setFull_name("John Doe");
        application.setId("GuideApplicant ID");
        application.setHigh_school(DTO_Highschool.getDefault());
        application.setEmail("guideApplicant@email.com");
        application.setPhone("555 555 55 55");
        application.setMajor(Department.ARTS);
        application.setCurrent_semester(2);
        application.setNext_semester_exchange(false);
        application.setHowdidyouhear("From a friend");
        application.setWhyapply("I want to help");

        return application;
    }

    public static DTO_GuideApplication fromApplication(GuideApplication application) {
        DTO_GuideApplication dto = new DTO_GuideApplication();

        dto.setFull_name(application.getProfile().getName());
        dto.setId(application.getBilkent_id());
        dto.setHigh_school(new DTO_Highschool(application.getProfile().getHighschool_id()));
        dto.setMajor(application.getProfile().getMajor());
        dto.setEmail(application.getProfile().getContact_info().getEmail());
        dto.setPhone(application.getProfile().getContact_info().getPhone());
        dto.setHowdidyouhear(application.getHeardFrom());
        dto.setWhyapply(application.getApplicationReason());
        dto.setNext_semester_exchange(application.isFutureExchange());
        dto.setCurrent_semester(application.getProfile().getSemester());

        return dto;
    }

    public String getFull_name() {
        return full_name;
    }

    public DTO_GuideApplication setFull_name(String full_name) {
        this.full_name = full_name;
        return this;
    }

    public String getId() {
        return id;
    }

    public DTO_GuideApplication setId(String id) {
        this.id = id;
        return this;
    }

    public DTO_Highschool getHigh_school() {
        return high_school;
    }

    public DTO_GuideApplication setHigh_school(DTO_Highschool high_school) {
        this.high_school = high_school;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public DTO_GuideApplication setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public DTO_GuideApplication setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public Department getMajor() {
        return major;
    }

    public DTO_GuideApplication setMajor(Department major) {
        this.major = major;
        return this;
    }

    public long getCurrent_semester() {
        return current_semester;
    }

    public DTO_GuideApplication setCurrent_semester(long current_semester) {
        this.current_semester = current_semester;
        return this;
    }

    public boolean isNext_semester_exchange() {
        return next_semester_exchange;
    }

    public DTO_GuideApplication setNext_semester_exchange(boolean next_semester_exchange) {
        this.next_semester_exchange = next_semester_exchange;
        return this;
    }

    public String getHowdidyouhear() {
        return howdidyouhear;
    }

    public DTO_GuideApplication setHowdidyouhear(String howdidyouhear) {
        this.howdidyouhear = howdidyouhear;
        return this;
    }

    public String getWhyapply() {
        return whyapply;
    }

    public DTO_GuideApplication setWhyapply(String whyapply) {
        this.whyapply = whyapply;
        return this;
    }
}
