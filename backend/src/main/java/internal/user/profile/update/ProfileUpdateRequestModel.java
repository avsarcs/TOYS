package internal.user.profile.update;

import models.ContactDetails;
import models.data.guides.GUIDE_EXPERIENCE_LEVEL;


public class ProfileUpdateRequestModel {
    // Just provide what is needed for the update
    private String name;
    private String image_b64;
    private String origin_highschool_id;

    private GUIDE_EXPERIENCE_LEVEL experience;
    private ContactDetails contactDetails;
    private String description;
}
