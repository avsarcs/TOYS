package auth.login;

import auth.LoginInfoModel;
import auth.UserModel;
import auth.services.JWTService;
import enums.roles.USER_ROLE;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class auth_login_Controller {

    @Autowired
    auth_login_Service loginService;

    @PostMapping("/auth/login")
    public String login(@RequestBody LoginInfoModel loginInfoModel) {
        UserModel loginResult = loginService.loginCredentialCheck(loginInfoModel);
        if (loginResult != null) {
            try {
                return JWTService
                        .getSimpleton()
                        .generateToken(loginInfoModel, loginResult.getRole());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return "";
    }
}
