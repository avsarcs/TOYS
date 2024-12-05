package server.models.people;

import java.util.Map;

public class Director extends User {
    public Director() {
        super();
    }
    protected Director(Map<String, Object> map) {
        super(map);
    }
    public static Director fromMap(Map<String, Object> map) {
        return new Director(map);
    }
}
