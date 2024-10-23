package auth;

import java.time.ZonedDateTime;

public class AuthEntryModel extends LoginInfoModel{
    private ZonedDateTime loginTime;
    private ZonedDateTime tokenExpirationTime;

    private final String token;

    public String getToken() {
        return token;
    }

    public AuthEntryModel(LoginInfoModel loginInfo, String token) {
        super(loginInfo.getBilkentID(), loginInfo.getPassword());
        loginTime = ZonedDateTime.now();
        tokenExpirationTime = loginTime.plusMinutes(5);
        this.token = token;
    }

    public void extend() {
        tokenExpirationTime = ZonedDateTime.now().plusMinutes(5);
    }

    public boolean isValid() {
        return tokenExpirationTime.isAfter(ZonedDateTime.now());
    }
}
