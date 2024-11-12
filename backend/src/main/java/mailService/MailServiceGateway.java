package mailService;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class MailServiceGateway {
    @Autowired
    MailFactory mailFactory;
    public void sendMail(String to, MailType type, Map<String,String> formFill) {
        MailTemplate template = mailFactory.getTemplates().get(type).fillDuplicate(formFill);
        System.out.println("Sending mail to " + to + " with subject: " + template.subject + " and body: " + template.body);
        // This will be incorporated with Bilkent's internal mailing system
    }
}
