package server.models.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.inject.Inject;
import org.springframework.beans.factory.annotation.Autowired;
import server.dbm.Database;
import server.models.schools.Highschool;

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

    public boolean equals(DTO_Highschool other) {
        return this.id.equals(other.id) && this.name.equals(other.name);
    }

    public static DTO_Highschool fromHS(Highschool hs) {
        DTO_Highschool dto = new DTO_Highschool();
        dto.setName(hs.getTitle());
        dto.setId(Highschool.getID(dto.getName()));
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