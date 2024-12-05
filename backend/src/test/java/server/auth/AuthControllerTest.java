package server.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.models.auth.LoginInfo;
import server.models.people.Guide;
import server.models.people.User;

@SpringBootTest
class AuthControllerTest {

    @Autowired
    AuthController authController;

    LoginInfo getAuth(User user) {
        return new LoginInfo(user.getBilkent_id(), user.getAuthInfo().getPassword());
    }


    @Test
    void login_successful() {
        String token = authController.login(getAuth(Guide.getDefault()));
        assert(token != null);
        assert(token.length() > 0);

        token = authController.login(getAuth(Guide.getDefault()).setPassword("false"));
        assert(token != null);
        assert(token.length() == 0);
    }

    @Test
    void isvalid() {
        String token = authController.login(getAuth(Guide.getDefault()));
        assert(token != null);
        assert(token.length() > 0);
        assert(authController.isvalid(token));
        assert (!authController.isvalid(token + "invalid token"));
    }
}