package auth.services;

import auth.AuthEntryModel;
import auth.LoginInfoModel;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.ArrayList;
import java.util.List;

public class JWTService {

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



    private List<AuthEntryModel> validTokens;

    public boolean isValid(String token) {
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

    public String generateToken(LoginInfoModel loginInfo) {
        String token = JWT.create()
                .withClaim("username", loginInfo.getBilkentID())
                .withClaim("password", loginInfo.getPassword())
                .sign(Algorithm.HMAC256(SECRET));

        while (lock) {

        }
        lock = true;
        validTokens.add(new AuthEntryModel(loginInfo, token));
        lock = false;
        return token;
    }
}
