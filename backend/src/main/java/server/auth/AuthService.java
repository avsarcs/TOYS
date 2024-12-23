package server.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.WriteResult;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import server.dbm.Database;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.auth.AuthEntry;
import server.models.auth.LoginInfo;
import server.models.people.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {
    @Autowired
    private Database database;

    @Autowired
    MailServiceGateway mail;

    public void forgotPass(String email, String id) {
        // if id present, send a recovery password to the email
        User user = null;
        if (id.isEmpty()) {
            List<User> users = database.people.fetchUsers().stream().filter(
                    u -> u.getProfile().getContact_info().getEmail().equals(email)
            ).toList();

            if (users.size() != 1) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "There are multiple users with the given email, we cannot ensure safety"
                );
            }

            user = users.get(0);

        } else {
            user = database.people.fetchUser(id);
        }

        if (user != null) {
            // send recovery password to the email
            String recoveryPass = UUID.randomUUID().toString();
            try {
                mail.sendMail(
                        user.getProfile().getContact_info().getEmail(),
                        Concerning.USER,
                        About.PASS_RECOVERY,
                        Status.APPROVAL,
                        Map.of("pass", recoveryPass)
                );

                user.setAuthInfo(user.getAuthInfo().setPassword(recoveryPass));
                database.people.updateUser(user);
            } catch (Exception e) {
                e.printStackTrace();
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "There was something wrong at our end, please contact administrator"
                );
            }
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User not found"
            );
        }
        // if id is not present, find a user that has the given email, then send that email a recovery password
        // otherwise return BAD_REQUEST
    }

    public void changePass(String auth, String newPass) {
        if (!check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You need to sign in to change your password!");
        }

        String userID = JWTService.getSimpleton().decodeUserID(auth);

        User user = database.people.fetchUser(userID);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }

        if (newPass.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password cannot be empty!");
        }

        if (newPass.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long!");
        }

        user.setAuthInfo(user.getAuthInfo().setPassword(newPass));

        database.people.updateUser(user);
    }

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
