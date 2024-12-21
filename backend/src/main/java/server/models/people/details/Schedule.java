package server.models.people.details;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.DailyPlan;

import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.Map;

public class Schedule {
    private Map<DayOfWeek, DailyPlan> schedule;
    protected Schedule(Map<String, Object> map) {
        for (String key: map.keySet()) {
            System.out.println("key: " + key );
        }
        schedule = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            schedule.put(
                    day,
                    DailyPlan.fromMap(
                            (Map<String, Object>) map.get(day.toString())
                    )
            );
        }
    }
    public static Schedule getDefault() {
        Schedule schedul = new Schedule();
        Map<DayOfWeek, DailyPlan> plan = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            plan.put(day, DailyPlan.getDefault());
        }
        schedul.setSchedule(plan);
        return schedul;
    }
    public Schedule() {
        schedule = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            schedule.put(day, new DailyPlan());
        }
    }
    public static Schedule fromMap(Map<String, Object> map) {
        return new Schedule((Map<String, Object>) map.get("schedule"));
    }

    @JsonIgnore
    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && schedule != null && !schedule.isEmpty();
            valid = valid && schedule.size() == 7;
            valid = valid && schedule.containsKey(DayOfWeek.MONDAY);
            valid = valid && schedule.containsKey(DayOfWeek.TUESDAY);
            valid = valid && schedule.containsKey(DayOfWeek.WEDNESDAY);
            valid = valid && schedule.containsKey(DayOfWeek.THURSDAY);
            valid = valid && schedule.containsKey(DayOfWeek.FRIDAY);
            valid = valid && schedule.containsKey(DayOfWeek.SATURDAY);
            valid = valid && schedule.containsKey(DayOfWeek.SUNDAY);
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public Map<DayOfWeek, DailyPlan> getSchedule() {
        return schedule;
    }

    public Schedule setSchedule(Map<DayOfWeek, DailyPlan> schedule) {
        this.schedule = schedule;
        return this;
    }
}
