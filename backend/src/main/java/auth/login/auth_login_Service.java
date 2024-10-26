package auth.login;

import auth.LoginInfoModel;
import auth.UserModel;
import dbm.dbe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class auth_login_Service {
    @Autowired
    private dbe databaseEngine;

    public UserModel loginCredentialCheck(LoginInfoModel loginInfo) {

        if (databaseEngine == null) {
            return null;
        }

        UserModel user = databaseEngine.fetchUser(loginInfo.getBilkentID());

        if (user == null) {
            // user no - existo
            return null;
        }


        try {
            if (user.getLoginInfo().getPassword().equals(loginInfo.getPassword())) {
                return user;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
