package server.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import server.enums.roles.UserRole;
import server.models.auth.AuthEntry;
import server.models.auth.LoginInfo;
import org.springframework.stereotype.Service;
import server.models.people.Guide;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class JWTService {

    public static String testToken = "test_" + UUID.randomUUID().toString();
    private static JWTService simpleton;

    public JWTService() {
        validTokens = new ArrayList<>();
    }

    public static JWTService getSimpleton() {
        if (simpleton == null) {
            simpleton = new JWTService();
        }
        return simpleton;
    }

    // Normally, this is supposed to be used with environmental variables, so it is kept secret.
    private static final String SECRET = "boo";

    private boolean lock = false;



    private List<AuthEntry> validTokens;

    public boolean isValid(String token) {
        if (token == testToken) {
            return true;
        }
        boolean result = false;
        for (int i = 0; i < validTokens.size(); i++) {
            if (validTokens.get(i).getToken().equals(token)) {
            // token time check
                result = validTokens.get(i).isValid();
                System.out.println("Token matches, validity: " + result);
                if (result) {
                    // extend the timespan of the token
                    validTokens.get(i).extend();
                }
                break;
            }
        }
        return result;
    }

    public UserRole getUserRole(String authToken) {
        if (authToken.equals(testToken)) {
            return UserRole.DIRECTOR;
        }
        try {
            return UserRole.valueOf(JWT.decode(authToken).getClaim("role").asString());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /// Compare given username with "username" claim in the token, return true if they match
    public boolean matchUsername(String authToken, String username) {
        if (authToken.equals(testToken)) {
            return username.equals(Guide.getDefault().getBilkent_id());
        }
        try {
            return JWT.decode(authToken).getClaim("username").asString().equals(username);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String decodeUserID(String authToken) {
        if (authToken.equals(testToken)) {
            return Guide.getDefault().getBilkent_id();
        }
        try {
            return JWT.decode(authToken).getClaim("username").asString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String generateToken(LoginInfo loginInfo, UserRole role) {
        String token = JWT.create()
                .withClaim("username", loginInfo.getBilkentID())
                .withClaim("password", loginInfo.getPassword())
                .withClaim("time", System.currentTimeMillis())
                .withClaim("role", role.toString())
                .sign(Algorithm.HMAC256(SECRET));

        while (lock) {

        }
        lock = true;
        validTokens.add(new AuthEntry(loginInfo, token));
        lock = false;
        return token;
    }
}
