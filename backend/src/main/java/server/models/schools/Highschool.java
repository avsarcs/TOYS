package server.models.schools;

public class Highschool {
    private String title;
    private String location;
    private HighschoolEntrenceDetails details;

    public static Highschool getDefault() {
        Highschool hs = new Highschool();
        hs.setTitle("Default HighSchool Name");
        hs.setLocation("Default HighSchool Location");
        hs.setDetails(HighschoolEntrenceDetails.getDefault());
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

    public Highschool setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getLocation() {
        return location;
    }

    public Highschool setLocation(String location) {
        this.location = location;
        return this;
    }

    public HighschoolEntrenceDetails getDetails() {
        return details;
    }

    public Highschool setDetails(HighschoolEntrenceDetails details) {
        this.details = details;
        return this;
    }
}
