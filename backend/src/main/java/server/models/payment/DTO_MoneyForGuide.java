package server.models.payment;

import java.util.Map;

public class DTO_MoneyForGuide {
    private DTO_GuidePaymentInfo guide;
    private double unpaid_hours;
    private double debt;
    private double money_paid;


    protected DTO_MoneyForGuide(Map<String, Object> map) {
        this.guide = DTO_GuidePaymentInfo.fromMap((Map<String, Object>) map.get("guide"));
        this.unpaid_hours = (double) map.get("unpaid_hours");
        this.debt = (double) map.get("debt");
        this.money_paid = (double) map.get("money_paid");
    }

    static public DTO_MoneyForGuide fromMap(Map<String, Object> map) {
        return new DTO_MoneyForGuide(map);
    }

    public DTO_MoneyForGuide() {};

    public DTO_GuidePaymentInfo getGuide() {
        return guide;
    }

    public DTO_MoneyForGuide setGuide(DTO_GuidePaymentInfo guide) {
        this.guide = guide;
        return this;
    }

    public double getUnpaid_hours() {
        return unpaid_hours;
    }

    public DTO_MoneyForGuide setUnpaid_hours(double unpaid_hours) {
        this.unpaid_hours = unpaid_hours;
        return this;
    }

    public double getDebt() {
        return debt;
    }

    public DTO_MoneyForGuide setDebt(double debt) {
        this.debt = debt;
        return this;
    }

    public double getMoney_paid() {
        return money_paid;
    }

    public DTO_MoneyForGuide setMoney_paid(double money_paid) {
        this.money_paid = money_paid;
        return this;
    }
}
