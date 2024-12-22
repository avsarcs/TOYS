package server.models.people;

import server.enums.roles.UserRole;
import server.enums.status.UserStatus;
import server.models.payment.FiscalState;
import server.models.people.details.AuthInfo;
import server.models.people.details.Profile;

import java.util.List;
import java.util.Map;

public class Director extends User {
    public Director() {
        super();
    }

    public static Director nonnull() {
        return new Director(Guide.nonnull());
    }

    protected Director(Map<String, Object> map) {
        super(map);
    }

    public Director(Guide guide) {
        super(guide);
    }

    public Director(Coordinator coordinator) {
        super(coordinator);
    }

    public Director modifyWithDto(Map<String, Object> map) {
        super.modifyWithDTO(map);
        return this;
    }
    public static Director fromMap(Map<String, Object> map) {
        return new Director(map);
    }

    public static Director getDefault() {
        Director director = new Director();
        director.profile = Profile.getDefault();
        director.status = UserStatus.ACTIVE;
        director.setAuthInfo(AuthInfo.getDefault());
        director.setBilkent_id("000003");
        director.setRole(UserRole.DIRECTOR);
        director.setApplication(GuideApplication.getDefault());
        director.setFiscalState(new FiscalState(0, 0, List.of()));
        return director;
    }
}
