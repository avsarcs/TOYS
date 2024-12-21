package server.models.schools;

import java.util.Map;

public class HighschoolRecord {
    private String title;
    private String location;
    private HighschoolEntranceDetails details;


    protected HighschoolRecord(HighschoolRecord other) {
        this.title = other.title;
        this.location = other.location;
        this.details = new HighschoolEntranceDetails(other.details);
    }

    protected HighschoolRecord(Map<String,Object> map) {
        title =(String) map.get("title");
        location = (String) map.get("location");
        details = HighschoolEntranceDetails.fromMap((Map<String,Object>) map.get("details"));
    }

    public static HighschoolRecord fromMap(Map<String, Object> map) {
        return new HighschoolRecord(map);
    }
    public HighschoolRecord() {};

    public static HighschoolRecord getDefault() {
        HighschoolRecord hs = new HighschoolRecord();
        hs.setTitle("Default HighSchool Name");
        hs.setLocation("Default HighSchool Location");
        hs.setDetails(HighschoolEntranceDetails.getDefault());
        return hs;
    }

    public static String getID(String name) {
        String ID = "";
        for (int i = 0; i < name.length(); i++) {
            ID += Integer.valueOf(name.charAt(i)).toString();
        }
        return ID;
    }

    public String getTitle() {
        return title;
    }

    public HighschoolRecord setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getLocation() {
        return location;
    }

    public HighschoolRecord setLocation(String location) {
        this.location = location;
        return this;
    }

    public HighschoolEntranceDetails getDetails() {
        return details;
    }

    public HighschoolRecord setDetails(HighschoolEntranceDetails details) {
        this.details = details;
        return this;
    }
}
