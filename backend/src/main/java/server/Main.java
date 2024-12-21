package server;

import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.status.ApplicationStatus;
import server.enums.status.TourStatus;
import server.models.events.TourRegistry;
import server.models.people.Advisor;
import server.models.people.Coordinator;
import server.models.people.Director;
import server.models.people.Guide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import server.models.schools.Highschool;

import java.nio.file.Files;
import java.nio.file.Path;

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
        //db.pushString(Files.readString(Path.of("src/main/resources/initialData.json")));
        db.people.addUser(Guide.getDefault());
        db.people.addUser(Advisor.getDefault());
        db.people.addUser(Coordinator.getDefault());
        db.people.addUser(Director.getDefault());
        TourRegistry tour = TourRegistry.getDefault();
        tour.setTour_id("tour_-2");
        tour.setTour_status(TourStatus.RECEIVED);
        db.tours.addTour(tour);


        tour.setTour_id("tour_-3");
        tour.setTour_status(TourStatus.CONFIRMED);
        db.tours.addTour(tour);

        tour.setTour_id("tour_-4");
        tour.setTour_status(TourStatus.REJECTED);
        db.tours.addTour(tour);

        tour.setTour_id("tour_-5");
        tour.setTour_status(TourStatus.CANCELLED);
        db.tours.addTour(tour);

        tour.setTour_id("tour_-6");
        tour.setTour_status(TourStatus.ONGOING);
        db.tours.addTour(tour);

        tour.setTour_id("tour_-7");
        tour.setTour_status(TourStatus.FINISHED);
        db.tours.addTour(tour);

        tour.setTour_id("tour_-8");
        tour.setTour_status(TourStatus.PENDING_MODIFICATION);
        db.tours.addTour(tour);
    }
}
