package server.models;

import server.enums.DayTimeSlots;
import server.enums.status.TimeSlotStatus;

import java.util.HashMap;
import java.util.Map;

public class DailyPlan {
    private Map<DayTimeSlots, TimeSlotStatus> dailyPlan;

    public static DailyPlan fromMap(Map<String, Object> map) {
        return new DailyPlan(map);
    }

    protected DailyPlan(Map<String, Object> map) {
        this.dailyPlan = new HashMap<>();
        for (String key : map.keySet()) {
            System.out.println("KEY: " + key);
        }
        for (DayTimeSlots slot : DayTimeSlots.values()) {
            dailyPlan.put(slot, TimeSlotStatus.valueOf((String) ((Map<String, Object>)map.get("dailyPlan")).get(slot.name())));
        }
    }
    public static DailyPlan getDefault() {
        DailyPlan dailyPlan = new DailyPlan();
        Map<DayTimeSlots, TimeSlotStatus> plan = dailyPlan.getDailyPlan();
        for (DayTimeSlots slot : DayTimeSlots.values()) {
            plan.put(slot, TimeSlotStatus.FREE);
        }
        dailyPlan.setDailyPlan(plan);
        return dailyPlan;
    }
    public DailyPlan() {
        this.dailyPlan = new HashMap<>();
        for (DayTimeSlots slot : DayTimeSlots.values()) {
            dailyPlan.put(slot, TimeSlotStatus.FREE);
        }
    }

    TimeSlotStatus getSlot(DayTimeSlots slot) {
        return dailyPlan.get(slot);
    }

    public Map<DayTimeSlots, TimeSlotStatus> getDailyPlan() {
        return dailyPlan;
    }

    public DailyPlan setDailyPlan(Map<DayTimeSlots, TimeSlotStatus> dailyPlan) {
        this.dailyPlan = dailyPlan;
        return this;
    }
}
