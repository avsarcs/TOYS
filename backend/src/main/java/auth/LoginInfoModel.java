package auth;


import java.util.Map;

public class LoginInfoModel {
    private String bilkentID;
    private String password;

    public LoginInfoModel(String username, String password) {
        this.bilkentID = username;
        this.password = password;
    }

    public static LoginInfoModel fromMap(Map<String, Object> map) {
        LoginInfoModel loginInfo = new LoginInfoModel((String) map.get("bilkentID"), (String) map.get("password"));
        return loginInfo;
    }

    public String getBilkentID() {
        return bilkentID;
    }
    public String getPassword() {
        return password;
    }


}
