package server.models.payment;

import java.util.List;
import java.util.Map;

public class FiscalState {
    private double owed;
    private double paid;

    private List<Payment> payments;

    public static FiscalState nonnull() {
        return new FiscalState(0, 0, List.of());
    }

    public FiscalState(FiscalState other) {
        this.owed = other.owed;
        this.paid = other.paid;
        this.payments = other.payments;
    }

    public FiscalState(double owed, double paid, List<Payment> payments) {
        this.owed = owed;
        this.paid = paid;
        this.payments = payments;
    }

    public FiscalState() {
    }

    protected FiscalState(Map<String, Object> map) {
        this.owed = ((Number) map.get("owed")).doubleValue();
        this.paid = ((Number) map.get("paid")).doubleValue();
        this.payments = ((List<Object>) map.get("payments")).stream().map(o -> Payment.fromMap((Map<String, Object>) o)).toList();
    }

    public static FiscalState fromMap(Map<String, Object> map) {
        return new FiscalState(map);
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public FiscalState setPayments(List<Payment> payments) {
        this.payments = payments;
        return this;
    }


    public double getOwed() {
        return owed;
    }

    public FiscalState setOwed(double owed) {
        this.owed = owed;
        return this;
    }

    public double getPaid() {
        return paid;
    }

    public FiscalState setPaid(double paid) {
        this.paid = paid;
        return this;
    }
}
