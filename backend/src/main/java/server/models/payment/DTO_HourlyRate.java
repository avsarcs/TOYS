package server.models.payment;

import server.models.time.ZTime;

import java.util.Map;

public class DTO_HourlyRate {
    private double rate;
    private ZTime applied_from;
    private ZTime applied_until;


    protected DTO_HourlyRate(Map<String, Object> map) {
        this.rate = (double) map.get("rate");
        this.applied_from = new ZTime((String) map.get("applied_from"));
        this.applied_until = new ZTime((String) map.get("applied_until"));
    }

    static public DTO_HourlyRate fromMap(Map<String, Object> map) {
        return new DTO_HourlyRate(map);
    }

    public DTO_HourlyRate() {
    }

    public double getRate() {
        return rate;
    }

    public DTO_HourlyRate setRate(double rate) {
        this.rate = rate;
        return this;
    }

    public ZTime getApplied_from() {
        return applied_from;
    }

    public DTO_HourlyRate setApplied_from(ZTime applied_from) {
        this.applied_from = applied_from;
        return this;
    }

    public ZTime getApplied_until() {
        return applied_until;
    }

    public DTO_HourlyRate setApplied_until(ZTime applied_until) {
        this.applied_until = applied_until;
        return this;
    }
}
