package server.internal.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.AuthController;
import server.auth.JWTService;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.DTO_UserType;
import server.models.auth.LoginInfo;
import server.models.people.Guide;
import server.models.people.User;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserControllerTest {


    @Autowired
    UserController userController;




    @Test
    void getAvailableGuides() {
        String auth = JWTService.testToken;
        assert(auth != null);
        List<DTO_SimpleGuide> list = userController.getAvailableGuides(auth, DTO_UserType.GUIDE, "2021-05-05T12:00:00Z[UTC]");
        assert(list != null);
        assert(list.size() > 0);

    }
}