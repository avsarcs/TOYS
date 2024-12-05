package server.mailService;

import org.springframework.stereotype.Service;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;

import java.util.Map;

@Service
public class MailFactory {
    private static Map<Concerning, Map<About, Map<Status, MailTemplate>>> templates;
    public MailFactory() {
        if (templates == null) {
            templates = Map.of(
                    Concerning.EVENT_APPLICANT, Map.of(
                            About.TOUR_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("About your request for a tour at Bilkent", "Your request for a tour at Bilkent was received!"),
                                    Status.APPROVAL, new MailTemplate("About your request for a tour at Bilkent", "Your tour request was accepted!\nPlease keep the following number safe and secure, as it is required to make changes: {tour_id}!"),
                                    Status.REJECTION, new MailTemplate("About your request for a tour at Bilkent", "We are sad to inform you that your request for a tour at Bilkent was rejected!"),
                                    Status.ERROR, new MailTemplate("About your request for a tour at Bilkent", "There was an error on our part on receiving your request. Please contact us for further assistance.")
                            ),
                            About.TOUR_MODIFICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("About your Bilkent tour modification request", "We received your request for a modification to your tour!"),
                                    Status.APPROVAL, new MailTemplate("About your Bilkent tour modification request", "Your tour modification request was accepted!\nPlease keep the following number safe and secure, as it is required to make further changes: {tour_id}!"),
                                    Status.REJECTION, new MailTemplate("About your Bilkent tour modification request", "We are sad to inform you that your modification request for the tour at Bilkent was rejected!"),
                                    Status.ERROR, new MailTemplate("About your Bilkent tour modification request", "There was an error on our part on receiving your request. Please contact us for further assistance.")
                            ),
                            About.FAIR_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("About your fair invite for Bilkent", "We received your invite to your fair!\nWe will respond as soon as possible."),
                                    Status.APPROVAL, new MailTemplate("About your fair invite for Bilkent", "Your fair invitation was accepted!\nPlease keep the following number private, safe and secure, as it is required to make changes: {fair_id}!"),
                                    Status.REJECTION, new MailTemplate("About your fair invite for Bilkent", "We are sad to inform you that your fair invitation was rejected."),
                                    Status.ERROR, new MailTemplate("About your fair invite for Bilkent", "There was an error on our part on receiving your request. Please contact us for further assistance.")
                            ),
                            About.FAIR_MODIFICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("About your fair invitation modification request", "We received your request for a modification to your fair!"),
                                    Status.APPROVAL, new MailTemplate("About your fair invitation modification request", "Your fair modification request was accepted!\nPlease keep the following number safe and secure, as it is required to make further changes: {fair_id}!"),
                                    Status.REJECTION, new MailTemplate("About your fair invitation modification request", "We are sad to inform you that your modification request for the fair was rejected!"),
                                    Status.ERROR, new MailTemplate("About your fair invitation modification request", "There was an error on our part on receiving your request. Please contact us for further assistance.")
                            )
                    ),
                    Concerning.GUIDE, Map.of(
                            About.GUIDE_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("FILL", "FILL"),
                                    Status.APPROVAL, new MailTemplate("FILL", "FILL"),
                                    Status.REJECTION, new MailTemplate("FILL", "FILL"),
                                    Status.ERROR, new MailTemplate("FILL", "FILL")
                            ),
                            About.GUIDE_ASSIGNMENT, Map.of(
                                    Status.RECIEVED, new MailTemplate("FILL", "FILL"),
                                    Status.APPROVAL, new MailTemplate("FILL", "FILL"),
                                    Status.REJECTION, new MailTemplate("FILL", "FILL"),
                                    Status.ERROR, new MailTemplate("FILL", "FILL")
                            ),
                            About.ADVISOR_APPLICATION, Map.of(
                                    Status.RECIEVED, new MailTemplate("FILL", "FILL"),
                                    Status.APPROVAL, new MailTemplate("FILL", "FILL"),
                                    Status.REJECTION, new MailTemplate("FILL", "FILL"),
                                    Status.ERROR, new MailTemplate("FILL", "FILL")
                            ))
            );
        }
    }

    public static Map<Concerning, Map<About, Map<Status, MailTemplate>>> getTemplates() {
        return templates;
    }


}
