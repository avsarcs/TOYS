package auth.login;

import auth.LoginInfoModel;
import auth.services.JWTService;
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
        boolean loginResult = loginService.loginCredentialCheck(loginInfoModel);
        if (loginResult) {
            try {
                return JWTService
                        .getSimpleton()
                        .generateToken(loginInfoModel);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return "";
    }
}
