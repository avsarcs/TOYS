package server.models.auth;


import java.util.Map;

public class LoginInfo {
    private String bilkentID;
    private String password;

    public LoginInfo(String username, String password) {
        this.bilkentID = username;
        this.password = password;
    }

    protected LoginInfo(Map<String, Object> map) {
        this.bilkentID = (String) map.get("bilkentID");
        this.password = (String) map.get("password");
    }

    public static LoginInfo fromMap(Map<String, Object> map) {
        LoginInfo loginInfo = new LoginInfo((String) map.get("bilkentID"), (String) map.get("password"));
        return loginInfo;
    }

    public String getBilkentID() {
        return bilkentID;
    }
    public String getPassword() {
        return password;
    }

    public LoginInfo setBilkentID(String bilkentID) {
        this.bilkentID = bilkentID;
        return this;
    }

    public LoginInfo setPassword(String password) {
        this.password = password;
        return this;
    }
}
