package server.internal.analytics.tours;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.status.TourStatus;
import server.models.events.TourRegistry;
import server.models.schools.Highschool;
import server.models.schools.HighschoolRecord;

import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsToursService {

    @Autowired
    private AuthService authService;

    @Autowired
    private Database database;

    public Map<String, Object> getTours(String auth) {

        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> days = new HashMap<>();
        Map<String, Object> statuses = new HashMap<>();
        Map<String, Object> cities = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            days.put(day.toString(), 0);
        }

        for (TourStatus stat : TourStatus.values()) {
            statuses.put(stat.name(), 0);
        }

        List<TourRegistry> tours = database.tours.fetchTours().values().stream().toList();

        tours.stream().forEach(
                tour -> {
                    DayOfWeek day = tour.getAccepted_time().getDate().getDayOfWeek();
                    days.put(day.toString(), (int) days.get(day.toString()) + 1);
                    statuses.put(tour.getTourStatus().name(), (int) statuses.get(tour.getTourStatus().name()) + 1);

                    HighschoolRecord hs = database.schools.getHighschoolByID(tour.getApplicant().getSchool());
                    if (hs != null) {
                        String tourCity = hs.getLocation();
                        if (cities.containsKey(tourCity)) {
                            cities.put(tourCity, (int) cities.get(tourCity) + 1);
                        } else {
                            cities.put(tourCity, 1);
                        }
                    }
                }
        );

        response.put("days", days);
        response.put("statuses", statuses);
        response.put("cities", cities);
        return response;
    }
}
