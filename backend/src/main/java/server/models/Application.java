package server.models;

import server.enums.status.ApplicationStatus;
import server.enums.types.ApplicationType;

import java.util.Map;

public class Application {
    private ApplicationType type;
    private ApplicationStatus status;

    public static Application nonnull() {
        return new Application().setType(ApplicationType.GUIDE).setStatus(ApplicationStatus.RECEIVED);
    }

    public Application() {

    }
    
    protected Application(Map<String, Object> map) {
        this.type = ApplicationType.valueOf((String) map.get("type"));
        this.status = ApplicationStatus.valueOf((String) map.get("status"));
    }

    public static Application fromMap(Map<String, Object> map) {
        return new Application()
            .setType(ApplicationType.valueOf((String) map.get("type")))
            .setStatus(ApplicationStatus.valueOf((String) map.get("status")));
    }

    public Application(Application application) {
        this.type = application.getType();
        this.status = application.getStatus();
    }


    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && type != null;
            valid = valid && status != null;
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public ApplicationType getType() {
        return type;
    }

    public Application setType(ApplicationType type) {
        this.type = type;
        return this;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public Application setStatus(ApplicationStatus status) {
        this.status = status;
        return this;
    }
}
