package server.models.people;

import server.enums.status.UserStatus;
import server.enums.roles.UserRole;
import server.models.Application;
import server.models.payment.FiscalState;
import server.models.people.details.AuthInfo;
import server.models.people.details.Profile;

import java.util.Map;

public class User {
    private UserRole role;
    protected String bilkent_id;

    private AuthInfo authInfo;
    protected UserStatus status;

    private Application application;
    private FiscalState fiscalState;

    protected Profile profile;

    public User() {

    }

    public User(User other) {
        this.role = other.role;
        this.authInfo = new AuthInfo(other.authInfo);
        this.application = new Application(other.application);
        this.profile = new Profile(other.profile);
        this.bilkent_id = other.bilkent_id;
        this.status = other.status;
        this.fiscalState = new FiscalState(other.fiscalState);
    }
    protected User(Map<String,Object> map) {
        this.role = UserRole.valueOf((String) map.get("role"));
        this.authInfo = AuthInfo.fromMap((Map<String, Object>) map.get("authInfo"));
        this.application = Application.fromMap((Map<String, Object>) map.get("application"));
        this.profile = Profile.fromMap((Map<String, Object>) map.get("profile"));
        this.bilkent_id = (String) map.get("bilkent_id");
        this.status = UserStatus.valueOf((String) map.get("status"));
        this.fiscalState = FiscalState.fromMap((Map<String, Object>) map.get("fiscalState"));
    }
    public static User fromMap(Map<String, Object> map) {
        return new User(map);
    }

    public FiscalState getFiscalState() {
        return fiscalState;
    }

    public User setFiscalState(FiscalState fiscalState) {
        this.fiscalState = fiscalState;
        return this;
    }

    public UserRole getRole() {
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

    public User setRole(UserRole role) {
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
