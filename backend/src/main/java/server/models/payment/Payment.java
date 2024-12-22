package server.models.payment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.time.ZTime;

import java.util.Map;

public class Payment {
    private double amount;
    private String to;
    private ZTime date;
    private String event_id;

    public Payment() {}

    public Payment(Payment other) {
        this.amount = other.amount;
        this.to = other.to;
        this.date = other.date;
        this.event_id = other.event_id;
    }
    protected Payment(Map<String, Object> map) {
        this.amount = ((Number) map.get("amount")).doubleValue();
        this.to = (String) map.get("to");
        this.date = new ZTime((String) map.get("date"));
        this.event_id = (String) map.get("event_id");
    }

    public static Payment fromMap(Map<String, Object> map) {
        return new Payment(map);
    }

    public double getAmount() {
        return amount;
    }

    public Payment setAmount(double amount) {
        this.amount = amount;
        return this;
    }

    public String getTo() {
        return to;
    }

    public Payment setTo(String to) {
        this.to = to;
        return this;
    }

    public ZTime getDate() {
        return date;
    }

    public Payment setDate(ZTime date) {
        this.date = date;
        return this;
    }

    public String getEvent_id() {
        return event_id;
    }

    public Payment setEvent_id(String event_id) {
        this.event_id = event_id;
        return this;
    }
}
