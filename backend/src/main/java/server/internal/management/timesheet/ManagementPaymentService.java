package server.internal.management.timesheet;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.roles.UserRole;
import server.models.DTO.DTOFactory;
import server.models.events.FairRegistry;
import server.models.events.TourRegistry;
import server.models.payment.Payment;
import server.models.people.Guide;
import server.models.people.User;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ManagementPaymentService {
    @Autowired
    DTOFactory dto;

    @Autowired
    Database db;

    @Autowired
    AuthService authService;

    public List<Map<String, Object>> getGuidesPaymentState(String auth, String name) {
        if (!authService.check(auth, Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to manage timesheet");
        }

        List<User> users = db.people.fetchUsers();

        List<Map<String, Object>> response = new ArrayList<>();

        SorensenDice alg = new SorensenDice();
        users.stream().filter(u -> name.isEmpty() || alg.similarity(u.getProfile().getName().toLowerCase(), name.toLowerCase()) > 0.8)
                        .forEach(u -> {
                            try {
                                response.add(dto.moneyForGuide(u));
                            } catch (Exception E) {
                                E.printStackTrace();
                                System.out.println("There was an error while processing the guide payment state for user with id: " + u.getBilkent_id());
                            }
                        });

        return response;
    }

    public Map<String, Object> getGuidePaymentState(String auth, String id) {
        if (!authService.check(auth, Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to manage timesheet");
        }

        User user = db.people.fetchUser(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Payment record not found!");
        }

        try {
            return dto.moneyForGuide(user);
        } catch (Exception E) {
            E.printStackTrace();
            System.out.println("There was an error while processing the guide payment state for user with id: " + user.getBilkent_id());
            return Map.of();
        }
    }

    public List<Map<String, Object>> getTourPaymentState(String auth, String guide_id) {
        if (!authService.check(auth, Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to manage timesheet");
        }

        User user = db.people.fetchUser(guide_id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No user found for the given id!");
        }

        if (!user.getRole().equals(UserRole.GUIDE) && !user.getRole().equals(UserRole.ADVISOR)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a guide!");
        }

        Guide guide = (Guide) user;
        Map<String, TourRegistry> tours = db.tours.fetchTours();
        Map<String, FairRegistry> fairs = db.fairs.fetchFairs();

        List<Map<String,Object>> response = new ArrayList<>();

        guide.getExperience().getPrevious_events().stream().forEach(
                event_id -> {
                    if (tours.containsKey(event_id)) {
                        TourRegistry tour = tours.get(event_id);
                        response.add(dto.moneyForEvent(tour, user.getFiscalState()));
                    } else if (fairs.containsKey(event_id)) {
                        FairRegistry fair = fairs.get(event_id);
                        response.add(dto.moneyForEvent(fair, user.getFiscalState()));
                    } else {
                        System.out.println("Event not found: " + event_id);
                    }
                }
        );

        return response;
    }

    public void payGuide(String auth, String guide_id) {
        if (!authService.check(auth, Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to manage timesheet");
        }

        User user = db.people.fetchUser(guide_id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No user found for the given id!");
        }

        if (!user.getRole().equals(UserRole.GUIDE) && !user.getRole().equals(UserRole.ADVISOR)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a guide!");
        }


        Guide guide = (Guide) user;
        List<Payment> newPayments = new ArrayList<>();

        getTourPaymentState(auth, guide_id).stream().forEach(
                event -> {
                    double owed = ((Number) event.get("money_debted")).doubleValue() - ((Number)event.get("money_paid")).doubleValue();
                    System.out.println("Owed before: " + owed);

                    System.out.println("Event: "+event.get("event_id")+" Owed: " + owed);
                    Payment payment = new Payment();
                    payment.setEvent_id((String) event.get("event_id"))
                            .setAmount(owed)
                            .setTo(guide.getBilkent_id())
                            .setDate(new ZTime(ZonedDateTime.now()));
                    newPayments.add(payment);
                });

        List<Payment> oldPayments = new ArrayList<>();
        oldPayments.addAll(guide.getFiscalState().getPayments());
        oldPayments.addAll(newPayments);
        guide.getFiscalState().setPayments(oldPayments);
        guide.getFiscalState().setOwed(oldPayments.stream().collect(Collectors.summarizingDouble(Payment::getAmount)).getSum());
        guide.getFiscalState().setPaid(oldPayments.stream().collect(Collectors.summarizingDouble(Payment::getAmount)).getSum());
        db.people.updateUser(guide);
    }
}
