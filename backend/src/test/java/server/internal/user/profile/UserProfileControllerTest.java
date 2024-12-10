package server.internal.user.profile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.JWTService;
import server.dbm.Database;
import server.models.DTO.DTO_Guide;
import server.models.DTO.DTO_Highschool;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.DTO_UserType;
import server.models.people.Guide;
import server.models.people.details.Profile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserProfileControllerTest {


    @Autowired
    UserProfileController userProfileController;


    @Test
    void getSimpleGuides() {
        String auth = JWTService.testToken;
        assert(auth != null);
        List<DTO_SimpleGuide> list = userProfileController.getSimpleGuides(auth, DTO_UserType.GUIDE);
        assert(list != null);
        assert(list.size() > 0);

    }

    @Test
    void getProfile() {
        Object profile = userProfileController.getProfile(JWTService.testToken, Guide.getDefault().getBilkent_id());
        if (profile instanceof DTO_Guide) {
            DTO_Guide original = DTO_Guide.fromGuide(Guide.getDefault());
            assertEquals(((DTO_Guide) profile).getPhone(), original.getPhone());
            assertEquals(((DTO_Guide) profile).getHigh_school().getId(), original.getHigh_school().getId());
            assertEquals(((DTO_Guide) profile).getProfile_picture(), original.getProfile_picture());
        }
        //TODO: add checks for other types of profiles, such as advisors, etc
    }

    @Test
    void updateProfile() {
        DTO_Guide profile = DTO_Guide.fromGuide(Guide.getDefault());
        DTO_Highschool hs = profile.getHigh_school();
        hs.setId("new highschool id");
        profile.setHigh_school(hs);
        userProfileController.updateProfile(
                Database.getObjectMapper().convertValue(profile, Map.class), JWTService.testToken);
        String updatedHS_ID = ((DTO_Guide) userProfileController.getProfile(JWTService.testToken, Guide.getDefault().getBilkent_id())).getHigh_school().getId();
        assertEquals(updatedHS_ID, "new highschool id");
        userProfileController.updateProfile(
                Database.getObjectMapper().convertValue(DTO_Guide.fromGuide(Guide.getDefault()), Map.class), JWTService.testToken);
    }
}