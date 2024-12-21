package server.models.people;

import server.enums.status.ApplicationStatus;
import server.enums.types.ApplicationType;
import server.enums.Department;
import server.enums.status.UserStatus;
import server.enums.roles.UserRole;
import server.models.Application;
import server.models.Experience;
import server.models.people.details.AuthInfo;
import server.models.people.details.Profile;

import java.time.DayOfWeek;
import java.util.Map;

public class Advisor extends Guide {
    private DayOfWeek responsibleFor;

    public Advisor() {

    }
    protected Advisor(Map<String, Object> map) {
        super(map);
        this.responsibleFor = DayOfWeek.valueOf((String) map.get("responsibleFor"));
    }

    public static Advisor getDefault() {
        Advisor advisor = new Advisor();
        advisor.setResponsibleFor(DayOfWeek.MONDAY);
        advisor.setExperience(Experience.getDefault());
        advisor.setHigh_school("000000");
        advisor.setRole(UserRole.ADVISOR);
        advisor.setStatus(UserStatus.ACTIVE);
        advisor.setAuthInfo(AuthInfo.getDefault());
        advisor.setApplication(new Application()
                .setType(ApplicationType.ADVISOR)
                .setStatus(ApplicationStatus.APPROVED)
        );
        advisor.setDepartment(Department.MANAGEMENT);
        advisor.setBilkent_id("000001");
        advisor.setProfile(Profile.getDefault());
        return advisor;
    }

    public static Advisor fromMap(Map<String, Object> map) {
        return new Advisor(map);
    }

    public DayOfWeek getResponsibleFor() {
        return responsibleFor;
    }

    public Advisor setResponsibleFor(DayOfWeek responsibleFor) {
        this.responsibleFor = responsibleFor;
        return this;
    }
}
