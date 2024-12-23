package server.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.Map;

public class Passkey {
    private String key;
    private ZTime expiration;
    private String event_id;

    public Passkey() {}

    protected Passkey(Map<String, Object> map) {
        this.key = (String) map.get("key");
        this.expiration = new ZTime((String) map.get("expiration"));
        this.event_id = (String) map.get("event_id");
    }

    static public Passkey fromMap(Map<String, Object> map) {
        return new Passkey(map);
    }

    @JsonIgnore
    public Passkey expire() {
        expiration.setDate(ZonedDateTime.now().plusDays(90000));
        return this;
    }

    @JsonIgnore
    public boolean expired() {
        return expiration.getDate().isBefore(ZonedDateTime.now());
    }

    public String getKey() {
        return key;
    }

    public Passkey setKey(String key) {
        this.key = key;
        return this;
    }

    public ZTime getExpiration() {
        return expiration;
    }

    public Passkey setExpiration(ZTime expiration) {
        this.expiration = expiration;
        return this;
    }

    public String getEvent_id() {
        return event_id;
    }

    public Passkey setEvent_id(String event_id) {
        this.event_id = event_id;
        return this;
    }
}
