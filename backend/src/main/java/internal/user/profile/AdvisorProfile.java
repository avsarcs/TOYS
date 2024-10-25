package internal.user.profile;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

// AdvisorProfile extends GuideProfile because they essentially a guide
public class AdvisorProfile extends GuideProfile{
    private List<DayOfWeek> responsibleFor;

    public static AdvisorProfile fromMap(Map<String, Object> map) {
        AdvisorProfile profile = new AdvisorProfile();
        profile.setResponsibleFor(new ArrayList<>());

        for (String weekday : (List<String>) map.get("responsibleFor")) {
            profile.getResponsibleFor().add(DayOfWeek.valueOf(weekday));
        }
        
        return profile;
    }

    public List<DayOfWeek> getResponsibleFor() {
        return responsibleFor;
    }

    public AdvisorProfile setResponsibleFor(List<DayOfWeek> responsibleFor) {
        this.responsibleFor = responsibleFor;
        return this;
    }
}
