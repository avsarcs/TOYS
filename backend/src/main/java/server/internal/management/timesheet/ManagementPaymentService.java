package server.internal.management.timesheet;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.models.payment.DTO_MoneyForGuide;
import server.models.payment.DTO_MoneyForTour;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ManagementPaymentService {
    @Autowired
    Database db;

    public List<DTO_MoneyForGuide> getGuidesPaymentState(String auth, String name) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to do this action!");
        }

        Map<String, DTO_MoneyForGuide> payments =  db.payments.getGuidePaymentStates("");
        List<DTO_MoneyForGuide> dtoPayments = new ArrayList<>();

        SorensenDice alg = new SorensenDice();
        try {

            dtoPayments.addAll(
                    payments.entrySet().stream().filter(
                            e -> alg.similarity(e.getKey(), name) > 0.7 || name.isEmpty()
                    ).map(Map.Entry::getValue).toList()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while processing payment records, please contact the developers.");
        }

        return dtoPayments;
    }

    public DTO_MoneyForGuide getGuidePaymentState(String auth, String id) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to do this action!");
        }

        Map<String, DTO_MoneyForGuide> payments =  db.payments.getGuidePaymentStates(id);

        if (!payments.containsKey(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment record not found!");
        }
        return payments.get(id);
    }

    public DTO_MoneyForTour getTourPaymentState(String auth, String tour_id) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to do this action!");
        }

        Map<String, DTO_MoneyForTour> payments =  db.payments.getTourPaymentStates(tour_id);

        if (!payments.containsKey(tour_id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment record not found!");
        }
        return payments.get(tour_id);

    }
}
