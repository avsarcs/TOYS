package server.models.people.details;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.Patterns;

import java.util.Map;

public class PaymentInfo {
    private String iban;

    public static PaymentInfo nonnull() {
        return new PaymentInfo().setIban("");
    }

    public PaymentInfo() {
    }

    public PaymentInfo(PaymentInfo other) {
        this.iban = other.getIban();
    }

    public static PaymentInfo getDefault() {
        return new PaymentInfo().setIban("TR89 3704 0044 3588 9126 02");
    }

    @JsonIgnore
    public boolean isValid() {
        boolean valid = true;
        try {
            if (iban.isEmpty()) {
                return true;
            }
            valid = valid && iban != null && !iban.isEmpty();
            valid = valid && iban.replaceAll(" ", "").matches(Patterns.IBAN.pattern());
        } catch (Exception e) {
            valid = false;
        }
        return valid;
    }

    public String getIban() {
        return iban;
    }

    public PaymentInfo setIban(String iban) {
        this.iban = iban;
        return this;
    }

    public static PaymentInfo fromMap(Map<String, Object> map) {
        return new PaymentInfo().setIban((String) map.get("iban"));
    }
}
