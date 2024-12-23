package server.mailService;

import java.util.Map;

public class MailTemplate {
    String subject;
    String body;

    public MailTemplate(String subject, String body) {
        this.subject = subject;
        this.body = body;
    }

    MailTemplate fillTemplate(Map<String, String> form) {
        for (String key : form.keySet()) {
            subject = subject.replaceAll("{" + key + "}", form.get(key));
            body = body.replaceAll("{" + key + "}", form.get(key));
        }
        return this;
    }

    MailTemplate fillDuplicate(Map<String, String> form) {
        return new MailTemplate(this.subject, this.body).fillTemplate(form);
    }
}
