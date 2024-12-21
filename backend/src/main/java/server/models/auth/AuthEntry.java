package server.models.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.Map;

public class AuthEntry extends LoginInfo {
    private ZTime loginTime;
    private ZTime tokenExpirationTime;

    private final String token;

    public String getToken() {
        return token;
    }

    protected AuthEntry(Map<String, Object> map) {
        super(map);
        token = (String) map.get("token");
        loginTime = new ZTime((String) map.get("loginTime"));
        tokenExpirationTime = new ZTime((String) map.get("tokenExpirationTime"));
    }

    static public AuthEntry fromMap(Map<String, Object> map) {
        return new AuthEntry(map);
    }
    public AuthEntry(LoginInfo loginInfo, String token) {
        super(loginInfo.getBilkentID(), loginInfo.getPassword());
        loginTime = new ZTime(ZonedDateTime.now());
        tokenExpirationTime = new ZTime(ZonedDateTime.now().plusMinutes(5));
        this.token = token;
    }

    public void extend() {
        tokenExpirationTime.setDate(ZonedDateTime.now().plusHours(5));
    }

    @JsonIgnore
    public boolean isValid() {
        return tokenExpirationTime.getDate().isAfter(ZonedDateTime.now());
    }

    public ZTime getLoginTime() {
        return loginTime;
    }

    public AuthEntry setLoginTime(ZTime loginTime) {
        this.loginTime = loginTime;
        return this;
    }

    public ZTime getTokenExpirationTime() {
        return tokenExpirationTime;
    }

    public AuthEntry setTokenExpirationTime(ZTime tokenExpirationTime) {
        this.tokenExpirationTime = tokenExpirationTime;
        return this;
    }
}
