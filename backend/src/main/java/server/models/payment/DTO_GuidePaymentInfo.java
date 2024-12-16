package server.models.payment;

import java.util.Map;

public class DTO_GuidePaymentInfo {
    private String id;
    private String name;
    private String iban;

    protected DTO_GuidePaymentInfo(Map<String, Object> map) {
        this.id = (String) map.get("id");
        this.name = (String) map.get("name");
        this.iban = (String) map.get("iban");
    }

    static public DTO_GuidePaymentInfo fromMap(Map<String, Object> map) {
        return new DTO_GuidePaymentInfo(map);
    }

    public DTO_GuidePaymentInfo(){}

    public String getId() {
        return id;
    }

    public DTO_GuidePaymentInfo setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public DTO_GuidePaymentInfo setName(String name) {
        this.name = name;
        return this;
    }

    public String getIban() {
        return iban;
    }

    public DTO_GuidePaymentInfo setIban(String iban) {
        this.iban = iban;
        return this;
    }
}
