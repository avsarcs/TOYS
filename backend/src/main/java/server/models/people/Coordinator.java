package server.models.people;

import server.enums.roles.UserRole;
import server.enums.status.UserStatus;
import server.models.payment.FiscalState;
import server.models.people.details.AuthInfo;
import server.models.people.details.Profile;

import java.util.List;
import java.util.Map;

public class Coordinator extends User {
    public Coordinator() {

    }

    public static Coordinator nonnull() {
        return new Coordinator(Guide.nonnull());
    }

    public static Coordinator getDefault() {
        Coordinator coordinator = new Coordinator();
        coordinator.profile = Profile.getDefault();
        coordinator.status = UserStatus.ACTIVE;
        coordinator.setAuthInfo(AuthInfo.getDefault());
        coordinator.setBilkent_id("000002");
        coordinator.setRole(UserRole.COORDINATOR);
        coordinator.setApplication(GuideApplication.getDefault());
        coordinator.setFiscalState(new FiscalState(0, 0, List.of()));
        return coordinator;
    }

    protected Coordinator(Map<String, Object> map) {
        super(map);
    }

    public Coordinator modifyWithDto(Map<String, Object> map) {
        super.modifyWithDTO(map);
        return this;
    }

    public Coordinator(Guide guide) {
        super(guide);
    }

    public Coordinator(Director director) {
        super(director);
    }

    public static Coordinator fromMap(Map<String, Object> map) {
        return new Coordinator(map);
    }
}
