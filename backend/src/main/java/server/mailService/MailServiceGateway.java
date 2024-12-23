package server.mailService;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tomcat.websocket.AuthenticatorFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import server.dbm.Database;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;

import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Map;
import java.util.Properties;

@Service
public class MailServiceGateway {
    @Autowired
    MailFactory mailFactory;

    private static String email = "";
    private static String pass = "";

    private final String credentialsFile = "email-perm.json";

    private static boolean authorized = false;

    public MailServiceGateway() {}

    private void authorize() {
        if (authorized) {
            return;
        }
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(getCredentials(credentialsFile)));
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> creds = mapper.readValue(reader, Map.class);
            MailServiceGateway.email = (String) creds.get("email");
            MailServiceGateway.pass = (String) creds.get("password");
            if (!email.isEmpty() && !pass.isEmpty()) {
                authorized = true;
                System.out.println("Creds got successfully!");
            }
            System.out.println("Problem getting credentials");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error in MailServiceGateway.java");
        }
    }

    private InputStream getCredentials(String credentialsFile) {
        ClassLoader classLoader = Database.class.getClassLoader();

        InputStream inputStream = classLoader.getResourceAsStream(credentialsFile);

        if (inputStream == null) {
            throw new IllegalArgumentException("File not found! " + credentialsFile);
        }
        return inputStream;
    }
    public void sendMail(String to, Concerning concerning, About about, Status status, Map<String,String> formFill) {
        authorize();
        try {
            if (MailFactory.getTemplates().containsKey(concerning)) {
                if (MailFactory.getTemplates().get(concerning).containsKey(about)) {
                    if (MailFactory.getTemplates().get(concerning).get(about).containsKey(status)) {
                        MailTemplate template = mailFactory.getTemplates().get(concerning).get(about).get(status).fillDuplicate(formFill);
                        sendActual(to, template.subject, template.body);
                        System.out.println("Sending mail to " + to + " with subject: " + template.subject + " and body: " + template.body);
                        // This will be incorporated with Bilkent's internal mailing system
                        return;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("You are missing : " + concerning.name() + " : " + about.name() + " : " + status.name());
            e.printStackTrace();
        }
        System.out.println("There was an error while sending the mail "
                + "[" + concerning.name() + ":" + about.name() + ":" + status.name()+"]"
        );
    }

    private static void sendActual(String to, String subject, String body) {
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "465");
        properties.setProperty("mail.smtp.ssl.enable", "true");
        properties.setProperty("mail.smtp.auth", "true");

        Session session = Session.getInstance(properties,
                new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(email, pass);
                    }
                });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(email));
            message.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(to));
            message.setSubject(subject);
            message.setText(body);

            Transport.send(message);
            System.out.println("Message sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("There was an error when trying to send the message");
        }

        // This will be incorporated with Bilkent's internal mailing system
        System.out.println("Sending mail to " + to + " with subject: " + subject + " and body: " + body);
    }
}
