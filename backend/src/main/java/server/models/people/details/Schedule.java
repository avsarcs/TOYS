package server.models.people.details;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.enums.DayTimeSlots;
import server.enums.status.TimeSlotStatus;
import server.models.DailyPlan;

import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.Map;

public class Schedule {
    private Map<DayOfWeek, Map<DayTimeSlots, TimeSlotStatus>> schedule;

    public Schedule(Schedule other) {
        this.schedule = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            Map<DayTimeSlots, TimeSlotStatus> dailyPlan = new HashMap<>();
            for (DayTimeSlots slot : DayTimeSlots.values()) {
                dailyPlan.put(slot, other.getSchedule().get(day).get(slot));
            }
            schedule.put(day, dailyPlan);
        }
    }

    protected Schedule(Map<String, Object> map) {
        schedule = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            Map<DayTimeSlots, TimeSlotStatus> dailyPlan = new HashMap<>();
            for (DayTimeSlots slot : DayTimeSlots.values()) {
                try {

                    dailyPlan.put(
                            slot,
                            TimeSlotStatus.valueOf(
                                    (String) (
                                            (Map<String, Object>) map.get(day.name())).get(slot.name()
                                    ))
                    );
                } catch (Exception E) {
                    System.out.println("Error in Schedule.java");
                }
            }
            schedule.put(
                    day,
                    dailyPlan
            );
        }
    }
    public static Schedule getDefault() {
        Schedule schedul = new Schedule();
        Map<DayOfWeek, Map<DayTimeSlots, TimeSlotStatus>> schedule = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            Map<DayTimeSlots, TimeSlotStatus> dailyPlan = new HashMap<>();
            for (DayTimeSlots slot : DayTimeSlots.values()) {
                dailyPlan.put(slot, TimeSlotStatus.FREE);
            }
            schedule.put(day, dailyPlan);
        }
        schedul.setSchedule(schedule);
        return schedul;
    }
    public Schedule() {
        schedule = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            Map<DayTimeSlots, TimeSlotStatus> dailyPlan = new HashMap<>();
            for (DayTimeSlots slot : DayTimeSlots.values()) {
                dailyPlan.put(slot, TimeSlotStatus.FREE);
            }
            schedule.put(day, dailyPlan);
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

    public Map<DayOfWeek, Map<DayTimeSlots, TimeSlotStatus>> getSchedule() {
        return schedule;
    }

    public Schedule setSchedule(Map<DayOfWeek, Map<DayTimeSlots, TimeSlotStatus>> schedule) {
        this.schedule = schedule;
        return this;
    }
}
