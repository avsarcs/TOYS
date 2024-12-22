package server.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AdminController {

    @Autowired
    AdminService adminService;

    @GetMapping("/admin/all-users")
    public List<Map<String, Object>> getAllUsers(@RequestParam String auth) {
        return adminService.getAllUsers(auth);
    }

    @PostMapping("/admin/change-role")
    public void changeRole(@RequestParam String auth, @RequestParam String id, @RequestParam String new_role) {
        adminService.changeRole(auth, id, new_role);
    }

    @PostMapping("/admin/add-user")
    public void addUser(@RequestParam String auth,@RequestParam String name,@RequestParam String role, @RequestParam String id) {
        adminService.addUser(auth, name, role, id);
    }

    @PostMapping("/admin/delete-user")
    public void deleteUser(@RequestParam String auth, @RequestParam String id) {
        adminService.removeUser(auth, id);
    }
}
