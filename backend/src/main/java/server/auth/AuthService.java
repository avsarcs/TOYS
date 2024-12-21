package server.auth;

import server.dbm.Database;
import server.models.auth.LoginInfo;
import server.models.people.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private Database databaseEngine;

    public User loginCredentialCheck(LoginInfo loginInfo) {

        if (databaseEngine == null) {
            return null;
        }

        User user = databaseEngine.people.fetchUser(loginInfo.getBilkentID());

        if (user == null) {
            // user no - existo
            return null;
        }


        try {
            if (user.getAuthInfo().getPassword().equals(loginInfo.getPassword())) {
                return user;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
