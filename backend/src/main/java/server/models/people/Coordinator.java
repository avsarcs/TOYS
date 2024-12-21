package server.models.people;

import java.util.Map;

public class Coordinator extends User {
    public Coordinator() {

    }

    protected Coordinator(Map<String, Object> map) {
        super(map);
    }

    public static Coordinator fromMap(Map<String, Object> map) {
        return new Coordinator(map);
    }
}
