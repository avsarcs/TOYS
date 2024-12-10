package server;

import server.auth.PermissionMap;
import server.dbm.Database;
import server.models.people.Advisor;
import server.models.people.Guide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
        //(scanBasePackages = {"auth", "server", "server/dbm", "server/apply", "server/respond", "server/internal", "server/mailService"})
public class Main implements CommandLineRunner {

    @Autowired
    Database db;

    public static void main(String[] args) {
        PermissionMap.initializeEntries();
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running");
        db.people.addUser(Guide.getDefault());
        db.people.addUser(Advisor.getDefault());
    }
}
