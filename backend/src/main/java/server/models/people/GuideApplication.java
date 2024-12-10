package server.models.people;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.enums.status.ApplicationStatus;
import server.enums.types.ApplicationType;
import server.models.Application;
import server.models.DTO.DTO_GuideApplication;
import server.models.people.details.Profile;

import java.util.Map;

public class GuideApplication extends Application {
    private String bilkent_id;
    private Profile profile;
    private String heardFrom;
    private String applicationReason;
    private boolean futureExchange;

    public static GuideApplication getDefault() {
        GuideApplication guideApplication = new GuideApplication();
        Guide defaultGuide = Guide.getDefault();
        guideApplication.setBilkent_id(defaultGuide.getBilkent_id());
        guideApplication.setProfile(Profile.getDefault());
        guideApplication.setStatus(ApplicationStatus.RECIEVED);
        guideApplication.setType(ApplicationType.GUIDE);
        guideApplication.setApplicationReason("Application reason");
        guideApplication.setHeardFrom("heard from");
        guideApplication.setFutureExchange(false);
        return guideApplication;
    }

    public GuideApplication() {
        super();
    }

    protected GuideApplication(Map<String, Object> map) {
        super(map);
        this.bilkent_id = (String) map.get("bilkent_id");
        this.profile = Profile.fromMap((Map<String, Object>) map.get("profile"));
        this.applicationReason = (String) map.get("applicationReason");
        this.heardFrom = (String) map.get("heardFrom");
        this.futureExchange = (boolean) map.get("futureExchange");
    }


    @JsonIgnore
    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && bilkent_id != null && !bilkent_id.isEmpty();
            valid = valid && profile.isValid();
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public static GuideApplication fromMap(Map<String, Object> map) {
        return new GuideApplication(map);
    }
    public static GuideApplication fromDTO(DTO_GuideApplication dto) {
        GuideApplication guideApplication = new GuideApplication();

        guideApplication.setBilkent_id(dto.getId());
        guideApplication.setProfile(Profile.fromDTO_GuideApplication(dto));
        guideApplication.setStatus(ApplicationStatus.RECIEVED);
        guideApplication.setType(ApplicationType.GUIDE);
        guideApplication.setApplicationReason(dto.getWhyapply());
        guideApplication.setHeardFrom(dto.getHowdidyouhear());
        guideApplication.setFutureExchange(dto.isNext_semester_exchange());


        return guideApplication;
    }

    public boolean isFutureExchange() {
        return futureExchange;
    }

    public GuideApplication setFutureExchange(boolean futureExchange) {
        this.futureExchange = futureExchange;
        return this;
    }

    public String getHeardFrom() {
        return heardFrom;
    }

    public GuideApplication setHeardFrom(String heardFrom) {
        this.heardFrom = heardFrom;
        return this;
    }

    public String getApplicationReason() {
        return applicationReason;
    }

    public GuideApplication setApplicationReason(String applicationReason) {
        this.applicationReason = applicationReason;
        return this;
    }

    public String getBilkent_id() {
        return bilkent_id;
    }

    public GuideApplication setBilkent_id(String bilkent_id) {
        this.bilkent_id = bilkent_id;
        return this;
    }

    public Profile getProfile() {
        return profile;
    }

    public GuideApplication setProfile(Profile profile) {
        this.profile = profile;
        return this;
    }
}
