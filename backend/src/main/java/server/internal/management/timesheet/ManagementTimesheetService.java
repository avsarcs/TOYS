package server.internal.management.timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.models.DTO.DTOFactory;
import server.models.payment.HourlyRate;
import server.models.time.ZTime;

import java.util.List;
import java.util.Map;

@Service
public class ManagementTimesheetService {
    @Autowired
    Database database;

    @Autowired
    DTOFactory dto;

    @Autowired
    AuthService authService;

    public void setHourlyRate(String auth, Map<String, Object> rateMap) {

        HourlyRate rate = dto.hourlyRate(rateMap);

        if (!authService.check(auth, Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to manage timesheet");
        }

        List<HourlyRate> rates =  database.payments.getRates();

        if (rates.isEmpty()) {
            rates.add(HourlyRate.millennia());
        }
        HourlyRate newRate = null;
        for (HourlyRate other : rates) {
            try {
                newRate = rate.overlap(other);
                if (newRate != null) {
                    break;
                }
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hourly Rate non-subset overlap!");
            }
        }

        if (newRate != null) {
            rates.add(newRate);
        }

        rates.add(rate);

        database.payments.setHourlyRates(rates);
    }

    public List<Map<String,Object>> getRates(String auth) {
        if (!authService.check(auth, Permission.MANAGE_TIMESHEET)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to manage timesheet");
        }
        return database.payments.getRates().stream().map(r -> dto.hourlyRate(r)).toList();
    }
}