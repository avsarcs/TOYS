package server.models.people;

import server.enums.roles.UserRole;
import server.enums.status.UserStatus;
import server.models.payment.FiscalState;
import server.models.people.details.AuthInfo;
import server.models.people.details.Profile;

import java.util.List;
import java.util.Map;

public class Administrator extends User{
    public Administrator() {

    }

    public static Administrator getDefault() {
        Administrator administrator = new Administrator();
        administrator.profile = Profile.getDefault();
        administrator.status = UserStatus.ACTIVE;
        administrator.setAuthInfo(AuthInfo.getDefault());
        administrator.setBilkent_id("admin");
        administrator.setRole(UserRole.ADMIN);
        administrator.setApplication(GuideApplication.getDefault());
        administrator.setFiscalState(new FiscalState(0, 0, List.of()));
        return administrator;
    }

    protected Administrator(Map<String, Object> map) {
        super(map);
    }

    public static Administrator fromMap(Map<String, Object> map) {
        return new Administrator(map);
    }
}
