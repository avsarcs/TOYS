package apply.guide;

import enums.DEPARTMENT;
import models.Patterns;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.regex.Pattern;

public class GuideApplicationModel {

    private String full_name;
    private String bilkent_id;
    private String email;
    private String phoneNumber;
    private DEPARTMENT department;
    private ZonedDateTime birth_date;
    private String IBAN;
    private String address;
    private int current_semester;
    private boolean next_semester_exchange;
    private String howdidyouhear;
    private String whyapply;


    public static GuideApplicationModel fromMap(Map<String, Object> map) {
        GuideApplicationModel application = new GuideApplicationModel();
        application.setFull_name((String) map.get("full_name"));
        application.setBilkent_id((String) map.get("bilkent_id"));
        application.setEmail((String) map.get("email"));
        application.setPhoneNumber((String) map.get("phoneNumber"));
        application.setDepartment(DEPARTMENT.valueOf((String) map.get("department")));
        application.setBirth_date(ZonedDateTime.parse((String) map.get("birth_date")));
        application.setIBAN((String) map.get("IBAN"));
        application.setAddress((String) map.get("address"));
        application.setCurrent_semester((int) map.get("current_semester"));
        application.setNext_semester_exchange((boolean) map.get("next_semester_exchange"));
        application.setHowdidyouhear((String) map.get("howdidyouhear"));
        application.setWhyapply((String) map.get("whyapply"));
        return application;
    }

    public boolean isValid() {
        boolean valid = true;
        try {
            valid = valid && full_name != null && !full_name.isEmpty();
            valid = valid && bilkent_id != null && !bilkent_id.isEmpty();
            valid = valid && email != null && !email.isEmpty();
            valid = valid && Patterns.EMAIL.matcher(email).matches();

            valid = valid && phoneNumber != null && !phoneNumber.isEmpty();
            valid = valid && Patterns.PHONE_NUMBER.matcher(phoneNumber).matches();

            valid = valid && department != null;
            valid = valid && birth_date != null;
            valid = valid && IBAN != null && !IBAN.isEmpty();
            valid = valid && Patterns.IBAN.matcher(IBAN).matches();

            valid = valid && address != null && !address.isEmpty();
            valid = valid && current_semester > 0;
            valid = valid && howdidyouhear != null && !howdidyouhear.isEmpty();
            valid = valid && whyapply != null && !whyapply.isEmpty();
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public String getFull_name() {
        return full_name;
    }

    public GuideApplicationModel setFull_name(String full_name) {
        this.full_name = full_name;
        return this;
    }

    public String getBilkent_id() {
        return bilkent_id;
    }

    public GuideApplicationModel setBilkent_id(String bilkent_id) {
        this.bilkent_id = bilkent_id;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public GuideApplicationModel setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public GuideApplicationModel setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public DEPARTMENT getDepartment() {
        return department;
    }

    public GuideApplicationModel setDepartment(DEPARTMENT department) {
        this.department = department;
        return this;
    }

    public ZonedDateTime getBirth_date() {
        return birth_date;
    }

    public GuideApplicationModel setBirth_date(ZonedDateTime birth_date) {
        this.birth_date = birth_date;
        return this;
    }

    public String getIBAN() {
        return IBAN;
    }

    public GuideApplicationModel setIBAN(String IBAN) {
        this.IBAN = IBAN;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public GuideApplicationModel setAddress(String address) {
        this.address = address;
        return this;
    }

    public int getCurrent_semester() {
        return current_semester;
    }

    public GuideApplicationModel setCurrent_semester(int current_semester) {
        this.current_semester = current_semester;
        return this;
    }

    public boolean isNext_semester_exchange() {
        return next_semester_exchange;
    }

    public GuideApplicationModel setNext_semester_exchange(boolean next_semester_exchange) {
        this.next_semester_exchange = next_semester_exchange;
        return this;
    }

    public String getHowdidyouhear() {
        return howdidyouhear;
    }

    public GuideApplicationModel setHowdidyouhear(String howdidyouhear) {
        this.howdidyouhear = howdidyouhear;
        return this;
    }

    public String getWhyapply() {
        return whyapply;
    }

    public GuideApplicationModel setWhyapply(String whyapply) {
        this.whyapply = whyapply;
        return this;
    }
}
