package server.models.people;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.AuthController;
import server.auth.JWTService;
import server.enums.roles.UserRole;
import server.models.auth.LoginInfo;

@SpringBootTest
class AdvisorTest {


    @Autowired
    AuthController authController;

    @Autowired
    JWTService jwtService;

    @Test
    void login_success() {

        Advisor advisor = Advisor.getDefault();
        String token = authController.login(new LoginInfo(advisor.getBilkent_id(), advisor.getAuthInfo().getPassword()));
        assert(token != null);
        assert(token.length() > 0);

        String decodeUserID = jwtService.decodeUserID(token);
        assert(decodeUserID.equals(advisor.getBilkent_id()));
        assert(jwtService.getUserRole(token) == UserRole.ADVISOR);
    }

    @Test
    void login_fail() {
        Advisor advisor = Advisor.getDefault();
        String token = authController.login(new LoginInfo(advisor.getBilkent_id(), "wrong password"));
        assert(token != null);
        assert (token.length() == 0);
    }

    @Test
    void isvalid() {
        Advisor advisor = Advisor.getDefault();
        String token = authController.login(new LoginInfo(advisor.getBilkent_id(), advisor.getAuthInfo().getPassword()));
        assert(token != null);
        assert(token.length() > 0);

        assert (authController.isvalid(token));
        assert (!authController.isvalid(token+"invalid token"));
    }
}