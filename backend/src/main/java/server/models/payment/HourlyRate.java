package server.models.payment;

import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.Map;

public class HourlyRate {
    private double rate;
    private ZTime applied_from;
    private ZTime applied_until;

    public boolean contains(ZonedDateTime time) {
        return applied_from.getDate().isBefore(time) && applied_until.getDate().isAfter(time);
    }

    public HourlyRate overlap(HourlyRate other) {
        if (this.applied_from.getDate().isAfter(other.applied_until.getDate().minusMinutes(1))
        || this.applied_until.getDate().isBefore(other.applied_from.getDate().plusMinutes(1))) {
            // No overlap, we good
            return null;
        } else if (this.applied_from.getDate().isAfter(other.applied_from.getDate().minusMinutes(1))
                && this.applied_until.getDate().isBefore(other.applied_until.getDate().plusMinutes(1))) {
            // this is a subset of the other

            // |      other           |
            //        | this |

            // | newRate | this | other |
            HourlyRate newRate = new HourlyRate();
            newRate.setRate(other.getRate());
            newRate.setApplied_from(new ZTime(other.getApplied_from().getDate()));
            newRate.setApplied_until(new ZTime(this.getApplied_from().getDate().minusNanos(1)));

            other.setApplied_from(new ZTime(this.getApplied_until().getDate().plusNanos(1)));

            return newRate;
        } else {
            // oh no, non subset overlap ('this' is not a subset of the 'other')
            throw new RuntimeException("Non-subset Hourly Rate overlap!");
        }

    }

    protected HourlyRate(Map<String, Object> map) {
        this.rate = (double) map.get("rate");
        this.applied_from = new ZTime((String) map.get("applied_from"));
        this.applied_until = new ZTime((String) map.get("applied_until"));
    }

    static public HourlyRate fromMap(Map<String, Object> map) {
        return new HourlyRate(map);
    }

    public static HourlyRate millennia() {
        return new HourlyRate()
                .setRate(0)
                .setApplied_from(new ZTime("1970-01-01T00:00:00Z"))
                .setApplied_until(new ZTime("9999-12-31T00:00Z"));
    }

    public HourlyRate() {
    }

    public double getRate() {
        return rate;
    }

    public HourlyRate setRate(double rate) {
        this.rate = rate;
        return this;
    }

    public ZTime getApplied_from() {
        return applied_from;
    }

    public HourlyRate setApplied_from(ZTime applied_from) {
        this.applied_from = applied_from;
        return this;
    }

    public ZTime getApplied_until() {
        return applied_until;
    }

    public HourlyRate setApplied_until(ZTime applied_until) {
        this.applied_until = applied_until;
        return this;
    }
}
