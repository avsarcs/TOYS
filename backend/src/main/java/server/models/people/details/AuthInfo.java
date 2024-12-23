package server.models.people.details;

import java.util.Map;

public class AuthInfo {
    private String password;

    public static AuthInfo nonnull() {
        return new AuthInfo().setPassword("");
    }

    public static AuthInfo fromMap(Map<String, Object> map) {
        return new AuthInfo()
            .setPassword((String) map.get("password"));
    }

    public AuthInfo() {
    }

    public AuthInfo(AuthInfo other) {
        this.password = other.getPassword();
    }
    

    public static AuthInfo getDefault() {
        return new AuthInfo()
            .setPassword("password");
    }

    public String getPassword() {
        return password;
    }

    public AuthInfo setPassword(String password) {
        this.password = password;
        return this;
    }
}
