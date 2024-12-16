package server.models.payment;

import server.models.DTO.DTO_Highschool;
import server.models.time.ZTime;

import java.util.Map;

public class DTO_MoneyForTour {
    private String tour_id;
    private ZTime tour_date;
    private DTO_Highschool tour_highschool;
    private double hours_worked;
    private double money_debted;
    private double money_paid;


    protected DTO_MoneyForTour(Map<String, Object> map) {
        this.tour_id = (String) map.get("tour_id");
        this.tour_date = ZTime.fromMap((Map<String, Object>) map.get("tour_date"));
        this.tour_highschool = DTO_Highschool.fromMap((Map<String, Object>) map.get("tour_highschool"));
        this.hours_worked = (double) map.get("hours_worked");
        this.money_debted = (double) map.get("money_debted");
        this.money_paid = (double) map.get("money_paid");
    }

    static public DTO_MoneyForTour fromMap(Map<String, Object> map) {
        return new DTO_MoneyForTour(map);
    }

    public DTO_MoneyForTour() {}

    public String getTour_id() {
        return tour_id;
    }

    public DTO_MoneyForTour setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }

    public ZTime getTour_date() {
        return tour_date;
    }

    public DTO_MoneyForTour setTour_date(ZTime tour_date) {
        this.tour_date = tour_date;
        return this;
    }

    public DTO_Highschool getTour_highschool() {
        return tour_highschool;
    }

    public DTO_MoneyForTour setTour_highschool(DTO_Highschool tour_highschool) {
        this.tour_highschool = tour_highschool;
        return this;
    }

    public double getHours_worked() {
        return hours_worked;
    }

    public DTO_MoneyForTour setHours_worked(double hours_worked) {
        this.hours_worked = hours_worked;
        return this;
    }

    public double getMoney_debted() {
        return money_debted;
    }

    public DTO_MoneyForTour setMoney_debted(double money_debted) {
        this.money_debted = money_debted;
        return this;
    }

    public double getMoney_paid() {
        return money_paid;
    }

    public DTO_MoneyForTour setMoney_paid(double money_paid) {
        this.money_paid = money_paid;
        return this;
    }
}
