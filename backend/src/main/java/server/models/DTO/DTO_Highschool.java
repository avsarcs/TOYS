package server.models.DTO;

import server.dbm.Database;
import server.models.schools.HighschoolRecord;

import java.util.Map;

public class DTO_Highschool {
    private String id;
    private String name;

    public static DTO_Highschool getDefault() {
        DTO_Highschool dto = new DTO_Highschool();
        dto.setId("Default HS ID");
        dto.setName("Default HighSchool Name");
        return dto;
    }
    public DTO_Highschool(String highschoolID) {
        setId(highschoolID);
        setName(Database.getInstance().schools.getHighschoolByID(highschoolID).getTitle());
    }
    public DTO_Highschool() {}

    protected DTO_Highschool(Map<String,Object> map) {
        this.id = (String) map.get("id");
        this.name = (String) map.get("name");
    }

    public static DTO_Highschool fromMap(Map<String,Object> map) {
        return new DTO_Highschool(map);
    }
    public boolean equals(DTO_Highschool other) {
        return this.id.equals(other.id) && this.name.equals(other.name);
    }

    public static DTO_Highschool fromHS(HighschoolRecord hs) {
        DTO_Highschool dto = new DTO_Highschool();
        dto.setName(hs.getTitle());
        dto.setId(HighschoolRecord.getID(dto.getName()));
        return dto;
    }

    public String getId() {
        return id;
    }

    public DTO_Highschool setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public DTO_Highschool setName(String name) {
        this.name = name;
        return this;
    }
}
