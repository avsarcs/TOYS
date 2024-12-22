package server;

import info.debatty.java.stringsimilarity.SorensenDice;
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
import server.models.schools.HighschoolRecord;
import server.models.schools.University;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

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

    private static void setRankings(Database db) {
        System.out.println("Setting rankings");
        System.out.println("Fetcing hs");
        List<HighschoolRecord> highschools = db.schools.getHighschools();

        System.out.println("Fetcing uni");
        University university = db.universities.getUniversity("bilkent");

        System.out.println("FETCHED");
        List<HighschoolRecord> finalHighschools = new ArrayList<>();
        SorensenDice alg = new SorensenDice();
        for (HighschoolRecord hs : highschools) {
            try {
                int priority = 0;
                if (!hs.getLocation().toLowerCase().contains("ankara")) {
                    priority += 1;
                }
                priority += Double.valueOf(hs.getDetails().getPuan().replaceAll(",",".")) / 250;

                AtomicLong stud = new AtomicLong(0);
                university.departments.stream().forEach(
                        d -> d.getYears().stream().forEach(y -> y.getHighschool_attendee_count().stream().filter(h -> alg.similarity(h.getSchool_name().toLowerCase(), hs.getTitle().toLowerCase()) > 0.8).findFirst().ifPresent(
                                s -> stud.addAndGet(s.getTotal())
                        ))
                );
                priority += stud.get() / 1000;
                if (priority > 4) {
                    priority = 4;
                }
                if (priority < 1) {
                    priority = 1;
                }
                hs.setPriority(String.valueOf(priority));
            } catch (Exception e) {
                hs.setPriority("1");
            }
            finalHighschools.add(hs);
        }

        System.out.println("Setting highschools : " + finalHighschools.size());
        db.schools.setHighschools(finalHighschools);
    }
}
