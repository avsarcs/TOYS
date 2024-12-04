package server.mailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;

import java.util.Map;

@Service
public class MailServiceGateway {
    @Autowired
    MailFactory mailFactory;

    public void sendMail(String to, Concerning concerning, About about, Status status, Map<String,String> formFill) {
        if (MailFactory.getTemplates().containsKey(concerning)) {
            if (MailFactory.getTemplates().get(concerning).containsKey(about)) {
                if (MailFactory.getTemplates().get(concerning).get(about).containsKey(status)) {
                    MailTemplate template = mailFactory.getTemplates().get(concerning).get(about).get(status).fillDuplicate(formFill);
                    System.out.println("Sending mail to " + to + " with subject: " + template.subject + " and body: " + template.body);
                    // This will be incorporated with Bilkent's internal mailing system
                    return;
                }
            }
        }
        System.out.println("There was an error while sending the mail "
                + "[" + concerning.name() + ":" + about.name() + ":" + status.name()+"]"
        );
    }
}
