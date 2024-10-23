package auth.isvalid;


import auth.services.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class auth_isvalid_Controller {

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
