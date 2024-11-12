package mailService;

import java.util.Map;

public class MailFactory {
    private static Map<MailType, MailTemplate> templates;
    public MailFactory() {
        if (templates == null) {
            templates = Map.of(
                MailType.TOUR_ACCEPTANCE, new MailTemplate("About your request for a tour at Bilkent", "Your tour was accepted!\nPlease keep the following number safe and secure, as it is required to make changes: {tour_id}!"),
                MailType.TOUR_REJECTION, new MailTemplate("About your request for a tour at Bilkent", "We are sad to inform you that your request for a tour at Bilkent was denied!")
            );
        }
    }
    public Map<MailType, MailTemplate> getTemplates() {
        return templates;
    }
}
