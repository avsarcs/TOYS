package server.models.people;

import server.enums.UserStatus;
import server.enums.roles.USER_ROLE;
import server.models.Application;
import server.models.people.details.AuthInfo;
import server.models.people.details.Profile;

import java.util.Map;

public class User {
    private USER_ROLE role;
    private String bilkent_id;

    private AuthInfo authInfo;
    private UserStatus status;

    private Application application;

    private Profile profile;

    public User() {

    }
    protected User(Map<String,Object> map) {
        this.role = USER_ROLE.valueOf((String) map.get("role"));
        this.authInfo = AuthInfo.fromMap((Map<String, Object>) map.get("authInfo"));
        this.application = Application.fromMap((Map<String, Object>) map.get("application"));
        this.profile = Profile.fromMap((Map<String, Object>) map.get("profile"));
        this.bilkent_id = (String) map.get("bilkent_id");
        this.status = UserStatus.valueOf((String) map.get("status"));
    }
    public static User fromMap(Map<String, Object> map) {
        return new User()
            .setRole(USER_ROLE.valueOf((String) map.get("role")))
            .setAuthInfo(AuthInfo.fromMap((Map<String, Object>) map.get("authInfo")))
            .setApplication(Application.fromMap((Map<String, Object>) map.get("application")))
            .setProfile(Profile.fromMap((Map<String, Object>) map.get("profile")))
            .setBilkent_id((String) map.get("bilkent_id"))
            .setStatus(UserStatus.valueOf((String) map.get("status")));
    }

    public USER_ROLE getRole() {
        return role;
    }

    public String getBilkent_id() {
        return bilkent_id;
    }

    public User setBilkent_id(String bilkent_id) {
        this.bilkent_id = bilkent_id;
        return this;
    }

    public UserStatus getStatus() {
        return status;
    }

    public User setStatus(UserStatus status) {
        this.status = status;
        return this;
    }

    public User setRole(USER_ROLE role) {
        this.role = role;
        return this;
    }

    public AuthInfo getAuthInfo() {
        return authInfo;
    }

    public User setAuthInfo(AuthInfo authInfo) {
        this.authInfo = authInfo;
        return this;
    }

    public Application getApplication() {
        return application;
    }

    public User setApplication(Application application) {
        this.application = application;
        return this;
    }

    public Profile getProfile() {
        return profile;
    }

    public User setProfile(Profile profile) {
        this.profile = profile;
        return this;
    }
}
