package server.dbm;

import server.models.DTO.DTO_Highschool;
import server.models.schools.Highschool;
import server.models.schools.HighschoolEntrenceDetails;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class DBSchoolService {

    public  Highschool getHighschoolByID(String id) {
        if (Objects.equals(id, DTO_Highschool.getDefault().getId())) {
            return Highschool.getDefault();
        }
        //TODO: connect to db
        return new Highschool().
                setTitle("ABC").
                setLocation("HELL").
                setDetails(
                        new HighschoolEntrenceDetails()
                                .setDuration("5 yıl")
                                .setLanguage("Almanca")
                                .setPuan("666.000000")
                                .setPercentile("1.0")
                                .setQuota("664")
                );
    }
}
