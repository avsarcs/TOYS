package server.internal.management.timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.models.payment.DTO_HourlyRate;
import server.models.time.ZTime;

import java.util.List;

@Service
public class ManagementTimesheetService {
    @Autowired
    Database database;

    public void setHourlyRate(String auth, DTO_HourlyRate rate) {

        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        if (PermissionMap.hasPermission(
                JWTService.getSimpleton().getUserRole(auth),
                server.auth.Permission.MANAGE_TIMESHEET)
        ) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "You do not have permission to manage timesheet!");
        }

        DTO_HourlyRate rateToAdd = null;
        List<DTO_HourlyRate> rates =  database.payments.getRates();
        for (DTO_HourlyRate r : rates) {
            if (rate.getApplied_from().getDate().isAfter(r.getApplied_from().getDate())
                    && rate.getApplied_until().getDate().isBefore(r.getApplied_from().getDate())) {
                rateToAdd = new DTO_HourlyRate()
                        .setRate(r.getRate())
                        .setApplied_from(rate.getApplied_until())
                        .setApplied_from(r.getApplied_until());

                r.setApplied_until(new ZTime(rate.getApplied_from().getDate().minusNanos(1))); // subtract one nanosecond, so they are TECHNICALLY not equal

                // Subset
            } else if (rate.getApplied_until().getDate().isBefore(r.getApplied_from().getDate())
                    || rate.getApplied_from().getDate().isAfter(r.getApplied_until().getDate())) {
                // No intersection
            } else {
                throw new ResponseStatusException(HttpStatus.valueOf(400), "Non-subset Hourly Rate overlap!");
            }
        }
        if (rateToAdd != null) {
            rates.add(rateToAdd);
        }
        rates.add(rate);
        database.payments.setHourlyRates(rates);
    }

    public List<DTO_HourlyRate> getRates() {
        return database.payments.getRates();
    }
}