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
}
