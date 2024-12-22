package server.models.schools;

import java.util.Map;

public class Highschool extends HighschoolRecord {
    private String name;
    private String city;
    private String id;
    private long ranking;
    private long priority;

    protected Highschool(Map<String, Object> map) {
        super(map);
        this.name = (String) map.get("name");
        this.city = (String) map.get("city");
        this.id = (String) map.get("id");
        this.ranking = (long) map.get("ranking");
        this.priority = (long) map.get("priority");
    }

    public static Highschool fromMap(Map<String, Object> map) {
        return new Highschool(map);
    }

    protected Highschool(HighschoolRecord base) {
        super(base);
    }

    public static Highschool getDefault() {
        Highschool hs = new Highschool(HighschoolRecord.getDefault());
        hs.setName(hs.getTitle());
        hs.setCity(hs.getLocation());
        hs.setId("Default HS ID");
        hs.setRanking(0);
        hs.setPriority(0);
        return hs;
    }

    public Highschool() {};

    public String getName() {
        return name;
    }

    public Highschool setName(String name) {
        this.name = name;
        return this;
    }

    public String getCity() {
        return city;
    }

    public Highschool setCity(String city) {
        this.city = city;
        return this;
    }

    public String getId() {
        return id;
    }

    public Highschool setId(String id) {
        this.id = id;
        return this;
    }

    public Highschool setRanking(long ranking) {
        this.ranking = ranking;
        return this;
    }

    public Highschool setPriority(long priority) {
        this.priority = priority;
        return this;
    }
}
