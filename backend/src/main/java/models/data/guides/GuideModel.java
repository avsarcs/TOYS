package models.data.guides;

import apply.guide.GuideApplicationModel;
import auth.LoginInfoModel;
import auth.UserModel;
import enums.DEPARTMENT;
import enums.roles.USER_ROLE;
import models.data.tours.TourModel;
import models.request.guides.dto.TourScorecardEntryDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GuideModel extends UserModel {
    private GuideApplicationModel application;
    private String high_school;
    private String profile_picture;
    private String profile_description;

    private GUIDE_EXPERIENCE_LEVEL experience_level;
    private long previous_tour_count;

    private List<TourModel> attendedTours;

    public static GuideModel fromApplication(GuideApplicationModel originalApplication) {
        GuideModel guide = new GuideModel();
        guide.setExperience_level(GUIDE_EXPERIENCE_LEVEL.APPLICANT);

        guide.setBilkentID(originalApplication.getBilkent_id());
        guide.setHigh_school("High School Not Set");

        guide.setRole(USER_ROLE.GUIDE);

        guide.setProfile_picture("");

        guide.setPrevious_tour_count(0);
        guide.setProfile_description(originalApplication.getWhyapply());
        guide.setApplication(originalApplication);

        guide.setAttendedTours(new ArrayList<>());

        return guide;
    }

    public List<TourModel> getAttendedTours() {
        return attendedTours;
    }

    public GuideModel setAttendedTours(List<TourModel> attendedTours) {
        this.attendedTours = attendedTours;
        return this;
    }

    public static GuideModel fromMap(Map<String, Object> map) {
        GuideModel guide = new GuideModel();
        guide.setBilkentID((String) map.get("bilkentID"));
        guide.setRole(USER_ROLE.valueOf((String) map.get("role")));

        guide.setHigh_school((String) map.get("high_school"));
        guide.setProfile_picture((String) map.get("profile_picture"));

        guide.setExperience_level(GUIDE_EXPERIENCE_LEVEL.valueOf((String) map.get("experience_level")));
        guide.setPrevious_tour_count((long) map.get("previous_tour_count"));
        guide.setProfile_description((String) map.get("profile_description"));

        try {
            guide.setLoginInfo(LoginInfoModel.fromMap((Map<String, Object>) map.get("loginInfo")));
        } catch (Exception e) {

        }

        if (map.get("attendedTours") != null) {
            // I know this is horrible to debug, it is horrible to understand however, I don't want to waste time writing a for loop. Oh this comment? This is important, and the time I spent writing this comment is worthwhile. Also the funcitonality of this comment cannot be delegated to some complex line of code that
            guide.setAttendedTours(((List<Map<String, Object>>) map.get("attendedTours")).stream().map(TourModel::fromMap).toList());
        }

        guide.setApplication(GuideApplicationModel.fromMap((Map<String, Object>) map.get("application")));
        return guide;
    }

    public GuideApplicationModel getApplication() {
        return application;
    }

    public GuideModel setApplication(GuideApplicationModel application) {
        this.application = application;
        return this;
    }

    public String getHigh_school() {
        return high_school;
    }

    public GuideModel setHigh_school(String high_school) {
        this.high_school = high_school;
        return this;
    }

    public String getProfile_picture() {
        return profile_picture;
    }

    public GuideModel setProfile_picture(String profile_picture) {
        this.profile_picture = profile_picture;
        return this;
    }


    public String getProfile_description() {
        return profile_description;
    }

    public GuideModel setProfile_description(String profile_description) {
        this.profile_description = profile_description;
        return this;
    }

    public GUIDE_EXPERIENCE_LEVEL getExperience_level() {
        return experience_level;
    }

    public GuideModel setExperience_level(GUIDE_EXPERIENCE_LEVEL experience_level) {
        this.experience_level = experience_level;
        return this;
    }

    public long getPrevious_tour_count() {
        return previous_tour_count;
    }

    public GuideModel setPrevious_tour_count(long previous_tour_count) {
        this.previous_tour_count = previous_tour_count;
        return this;
    }
}
