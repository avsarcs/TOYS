package server.models.people;

import server.auth.AuthController;
import server.auth.JWTService;
import server.enums.roles.USER_ROLE;
import server.models.auth.LoginInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class GuideTest {

    @Autowired
    AuthController authController;

    @Autowired
    JWTService jwtService;

    @Test
    void login_success() {

        Guide guide = Guide.getDefault();
        String token = authController.login(new LoginInfo(guide.getBilkent_id(), guide.getAuthInfo().getPassword()));
        assert(token != null);
        assert(token.length() > 0);

        String decodeUserID = jwtService.decodeUserID(token);
        assert(decodeUserID.equals(guide.getBilkent_id()));
        assert(jwtService.getUserRole(token) == USER_ROLE.GUIDE);
    }

    @Test
    void login_fail() {
        Guide guide = Guide.getDefault();
        String token = authController.login(new LoginInfo(guide.getBilkent_id(), "wrong password"));
        assert(token != null);
        assert (token.length() == 0);
    }

    @Test
    void isvalid() {
        Guide guide = Guide.getDefault();
        String token = authController.login(new LoginInfo(guide.getBilkent_id(), guide.getAuthInfo().getPassword()));
        assert(token != null);
        assert(token.length() > 0);

        assert (authController.isvalid(token));
        assert (!authController.isvalid(token+"invalid token"));
    }
}