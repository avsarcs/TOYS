package server.models;

import server.enums.DayTimeSlots;

import java.util.HashMap;
import java.util.Map;

public class DailyPlan {
    private Map<DayTimeSlots, Boolean> dailyPlan;

    public static DailyPlan fromMap(Map<String, Object> map) {
        return new DailyPlan(map);
    }

    protected DailyPlan(Map<String, Object> map) {
        this.dailyPlan = new HashMap<>();
        for (DayTimeSlots slot : DayTimeSlots.values()) {
            dailyPlan.put(slot, (Boolean) map.get(slot.toString()));
        }
    }
    public static DailyPlan getDefault() {
        DailyPlan dailyPlan = new DailyPlan();
        Map<DayTimeSlots, Boolean> plan = dailyPlan.getDailyPlan();
        for (DayTimeSlots slot : DayTimeSlots.values()) {
            plan.put(slot, false);
        }
        dailyPlan.setDailyPlan(plan);
        return dailyPlan;
    }
    public DailyPlan() {
        this.dailyPlan = new HashMap<>();
        for (DayTimeSlots slot : DayTimeSlots.values()) {
            dailyPlan.put(slot, false);
        }
    }

    Boolean getSlot(DayTimeSlots slot) {
        return dailyPlan.get(slot);
    }
    public Map<DayTimeSlots, Boolean> getDailyPlan() {
        return dailyPlan;
    }

    public DailyPlan setDailyPlan(Map<DayTimeSlots, Boolean> dailyPlan) {
        this.dailyPlan = dailyPlan;
        return this;
    }
}
