package server.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.WriteResult;
import server.dbm.Database;
import server.models.auth.AuthEntry;
import server.models.auth.LoginInfo;
import server.models.people.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private Database database;

    public String login(LoginInfo loginInfo) {
        String token = "";

        User user = database.people.fetchUser(loginInfo.getBilkentID());
        if (user == null) {return "";}

        try {
            if (user.getAuthInfo().getPassword().equals(loginInfo.getPassword())) {
                token = JWTService
                        .getSimpleton()
                        .generateToken(loginInfo, user.getRole());

                if (token.isEmpty()) {return token;}

                AuthEntry authEntry = new AuthEntry(loginInfo, token);
                database.auth.addAuthEntry(authEntry);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }

        return token;
    }

    public boolean check(String auth, Permission ... permissions) {
        Map<String, AuthEntry> tokens = database.auth.getTokens();

        try {
            if (!tokens.containsKey(auth)) {
                return false;
            }

            AuthEntry authEntry = tokens.get(auth);
            if (!authEntry.isValid()) {
                return false;
            }

            authEntry.extend();

            database.auth.updateToken(authEntry);

            for (Permission permission : permissions) {
                if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), permission)) {
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check auth with DB");
            return false;
        }
    }

    public boolean checkWithPasskey(String auth, String event_id, Permission ... permissions) {
        try {
            boolean standard = check(auth, permissions);
            if (standard) {
                return true;
            }

            Map<String, Passkey> passkeys = database.auth.getPasskeys();

            if (event_id.isEmpty()) {
                return passkeys.entrySet().stream().anyMatch(
                        e -> e.getValue().getKey().equals(auth) && !e.getValue().expired()
                );
            }
            if (!passkeys.containsKey(event_id)) {
                return false;
            }

            if (passkeys.get(event_id).expired()) {
                return false;
            }

            if (!passkeys.get(event_id).getKey().equals(auth)) {
                return false;
            }

            return true;

        } catch (Exception E) {
            return false;
        }
    }

}
