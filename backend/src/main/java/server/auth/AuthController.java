package server.auth;

import server.models.auth.LoginInfo;
import server.models.people.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @Autowired
    AuthService loginService;

    @PostMapping("/auth/login")
    public String login(@RequestBody LoginInfo loginInfoModel) {
        User loginResult = loginService.loginCredentialCheck(loginInfoModel);
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

    @GetMapping("/auth/isvalid")
    public boolean isvalid(@RequestParam("auth") String authToken) {
        try {
            return JWTService.getSimpleton().isValid(authToken);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
