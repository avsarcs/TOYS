package server.internal.user.profile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.JWTService;
import server.dbm.Database;
import server.models.people.Guide;
import server.models.people.details.Profile;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserProfileControllerTest {


    @Autowired
    UserProfileController userProfileController;

    @Test
    void getProfile() {
        Profile profile = userProfileController.getProfile(JWTService.testToken, Guide.getDefault().getBilkent_id());
        Profile original = Guide.getDefault().getProfile();
        assertEquals(profile.getHighschool_id(), original.getHighschool_id());
        assertEquals(profile.getContact_info().getEmail(), original.getContact_info().getEmail());
        assertEquals(profile.getProfile_picture(), original.getProfile_picture());
    }

    @Test
    void updateProfile() {
        Profile profile = Guide.getDefault().getProfile();
        profile.setHighschool_id("new highschool id");
        userProfileController.updateProfile(profile, JWTService.testToken);
        String updatedHS_ID = userProfileController.getProfile(JWTService.testToken, Guide.getDefault().getBilkent_id()).getHighschool_id();
        assertEquals(updatedHS_ID, "new highschool id");
        userProfileController.updateProfile(Guide.getDefault().getProfile(), JWTService.testToken);
    }
}