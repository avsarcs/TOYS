package auth;

import enums.roles.USER_ROLE;

import java.util.Map;

public class UserModel {

    private USER_ROLE role;

    private String bilkentID;

    private LoginInfoModel loginInfo;

    public LoginInfoModel getLoginInfo() {
        return loginInfo;
    }



    public UserModel(String id, LoginInfoModel loginInfo) {
        this.bilkentID = id;
        this.loginInfo = loginInfo;
    }

    public UserModel() {}

    public USER_ROLE getRole() {
        return role;
    }

    public UserModel setRole(USER_ROLE role) {
        this.role = role;
        return this;
    }

    public String getBilkentID() {
        return bilkentID;
    }

    public UserModel setBilkentID(String bilkentID) {
        this.bilkentID = bilkentID;
        return this;
    }

    public UserModel setLoginInfo(LoginInfoModel loginInfo) {
        this.loginInfo = loginInfo;
        return this;
    }
}
