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

    public boolean loginCredentialCheck(LoginInfoModel loginInfo) {

        if (databaseEngine == null) {
            return false;
        }

        UserModel user = databaseEngine.fetchUser(loginInfo.getBilkentID());

        if (user == null) {
            // user no - existo
            return false;
        }


        try {
            return user.getLoginInfo().getPassword().equals(loginInfo.getPassword());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
