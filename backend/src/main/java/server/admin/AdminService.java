package server.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.roles.UserRole;
import server.enums.status.UserStatus;
import server.models.DTO.DTOFactory;
import server.models.payment.FiscalState;
import server.models.people.*;
import server.models.people.details.AuthInfo;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    @Autowired
    Database database;

    @Autowired
    AuthService authService;

    @Autowired
    DTOFactory dto;
    public List<Map<String, Object>> getAllUsers(String auth) {
        if (!authService.check(auth, Permission.ADMINISTRATOR))
        {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Good try, but you are not authorized.");
        }

        List<User> users = database.people.fetchUsers();
        users = users.stream().filter(user -> !user.getRole().equals(UserRole.ADMIN)).toList();

        return users.stream().map(dto::simpleUser).toList();
    }

    public void changeRole(String auth, String id, String role) {
        if (!authService.check(auth, Permission.ADMINISTRATOR))
        {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Good try, but you are not authorized.");
        }

        List<User> users = database.people.fetchUsers();
        if (!users.stream().anyMatch(user -> user.getBilkent_id().equals(id))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found.");
        }

        UserRole wantedRole = null;
        try {
            wantedRole = UserRole.valueOf(role);
        } catch (Exception e) {
            wantedRole = UserRole.GUIDE;
        }

        try {
            User user = users.stream().filter(u -> u.getBilkent_id().equals(id)).findFirst().get();

            User newUser = null;

            if (user.getRole().equals(UserRole.GUIDE)) {
                Guide guide = database.people.fetchGuides(id).get(0);
                database.people.deleteUser(id, UserRole.GUIDE);

                newUser = switch (wantedRole) {
                    case GUIDE -> guide;
                    case ADVISOR -> new Advisor(guide);
                    case COORDINATOR -> new Coordinator(guide);
                    case DIRECTOR -> new Director(guide);
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role.");
                };

            }
            if (user.getRole().equals(UserRole.ADVISOR)) {
                Advisor advisor = database.people.fetchAdvisors(id).get(0);
                database.people.deleteUser(id, UserRole.ADVISOR);
                newUser = switch (wantedRole) {
                    case GUIDE -> new Guide(advisor);
                    case ADVISOR -> advisor;
                    case COORDINATOR -> new Coordinator(advisor);
                    case DIRECTOR -> new Director(advisor);
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role.");
                };
            }
            if (user.getRole().equals(UserRole.COORDINATOR)) {
                Coordinator coordinator = database.people.fetchCoordinators(id).get(0);
                database.people.deleteUser(id, UserRole.COORDINATOR);

                newUser = switch (wantedRole) {
                    case GUIDE -> new Guide(coordinator);
                    case ADVISOR -> new Advisor(coordinator);
                    case COORDINATOR -> coordinator;
                    case DIRECTOR -> new Director(coordinator);
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role.");
                };
            }

            if (user.getRole().equals(UserRole.DIRECTOR)) {
                Director director = database.people.fetchDirectors(id).get(0);
                database.people.deleteUser(id, UserRole.DIRECTOR);

                newUser = switch (wantedRole) {
                    case GUIDE -> new Guide(director);
                    case ADVISOR -> new Advisor(director);
                    case COORDINATOR -> new Coordinator(director);
                    case DIRECTOR -> director;
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role.");
                };
            }

            if (newUser == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role.");
            }

            newUser.setRole(wantedRole);
            newUser.setStatus(UserStatus.ACTIVE);
            database.people.addUser(newUser);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found.");
        }
    }

    public void addUser(String auth, String name, String requestedRole, String id) {
        if (!authService.check(auth, Permission.ADMINISTRATOR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Good try, but you are not authorized.");
        }

        UserRole role = null;
        try {
            role = UserRole.valueOf(requestedRole);
        } catch (Exception e) {
            role = UserRole.GUIDE;
        }

        User user = switch (role) {
            case GUIDE -> Guide.nonnull();
            case ADVISOR -> Advisor.nonnull().setRole(UserRole.ADVISOR);
            case COORDINATOR -> Coordinator.nonnull().setRole(UserRole.COORDINATOR);
            case DIRECTOR -> Director.nonnull().setRole(UserRole.DIRECTOR);
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role.");
        };

        user.setProfile(user.getProfile().setName(name));
        user.setBilkent_id(id);
        user.setStatus(UserStatus.ACTIVE);
        user.setAuthInfo(new AuthInfo().setPassword("password"));
        user.setRole(role);

        database.people.addUser(user);
    }

    public void removeUser(String auth, String id) {
        if (!authService.check(auth, Permission.ADMINISTRATOR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Good try, but you are not authorized.");
        }

        List<User> users = database.people.fetchUsers();
        if (!users.stream().anyMatch(user -> user.getBilkent_id().equals(id))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found.");
        }

        User user = users.stream().filter(u -> u.getBilkent_id().equals(id)).findFirst().get();

        database.people.deleteUser(id, user.getRole());
    }
}
