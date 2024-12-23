package server.auth;

import server.models.auth.LoginInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/auth/login")
    public String login(@RequestBody LoginInfo loginInfoModel) {
        return authService.login(loginInfoModel);
    }

    @GetMapping("/auth/isvalid")
    public boolean isvalid(@RequestParam("auth") String auth) {
        return authService.check(auth);
    }

    @PostMapping("/auth/pass/forgot")
    public void forgotPass(@RequestParam String email, @RequestParam String id) {
        authService.forgotPass(email, id);
    }

    @PostMapping("/auth/pass/change")
    public void changePass(@RequestParam String auth, @RequestBody String newpass) {
        authService.changePass(auth, newpass);
    }
}
