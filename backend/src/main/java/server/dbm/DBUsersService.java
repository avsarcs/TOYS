package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;
import server.enums.roles.UserRole;
import server.models.people.*;

import java.time.DayOfWeek;
import java.util.*;

@Service
public class DBUsersService {

    private Firestore firestore;
    private ObjectMapper mapper;

    public DBUsersService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }

    public User fetchUser(String bilkentID) {
        List<User> users = new ArrayList<>();
        users.addAll(fetchGuides(bilkentID));
        users.addAll(fetchAdvisors(bilkentID));
        users.addAll(fetchCoordinators(bilkentID));
        users.addAll(fetchDirectors(bilkentID));

        if (users.size() == 0) {
            return null;
        }
        return users.get(0);
    }

    public List<User> fetchUsers() {
        List<User> users = new ArrayList<User>();
        try {
            users.addAll(fetchGuides(null));
            users.addAll(fetchAdvisors(null));
            users.addAll(fetchCoordinators(null));
            users.addAll(fetchDirectors(null));
            users.addAll(fetchAdmins(null));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch users from database.");
        }
        return users;
    }

    public List<Administrator> fetchAdmins(String bilkentID) {
        List<Administrator> admins = new ArrayList<Administrator>();

        try {
            DocumentReference reference = firestore.collection("people").document("admins");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("admins");

            if (bilkentID == null || bilkentID.isEmpty()) {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    admins.add(Administrator.fromMap((Map<String, Object>) entry.getValue()));
                }
            } else {
                if (data.containsKey(bilkentID)) {
                    admins.add(Administrator.fromMap((Map<String, Object>) data.get(bilkentID)));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch guides from database.");
        }
        return admins;
    }

    public void deleteUser(String bilkentID, UserRole role) {
        String document = "";
        document = role.equals(UserRole.GUIDE) ? "guides" : document;
        document = role.equals(UserRole.ADVISOR) ? "advisors" : document;
        document = role.equals(UserRole.COORDINATOR) ? "coordinators" : document;
        document = role.equals(UserRole.DIRECTOR) ? "directors" : document;
        DocumentReference reference = firestore.collection("people").document(document);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            data.remove(bilkentID);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {
                            }));

            System.out.println("User [" + bilkentID + "] removed." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add user to database.");
        }
    }

    public List<Guide> fetchGuides(String bilkentID) {
        List<Guide> guides = new ArrayList<Guide>();
        try {
            DocumentReference reference = firestore.collection("people").document("guides");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("guides");

            if (bilkentID == null) {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    guides.add(Guide.fromMap((Map<String, Object>) entry.getValue()));
                }
            } else {
                if (data.containsKey(bilkentID)) {
                    guides.add(Guide.fromMap((Map<String, Object>) data.get(bilkentID)));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch guides from database.");
        }
        return guides;
    }
    public List<Advisor> fetchAdvisors(String bilkentID) {
        List<Advisor> advisors = new ArrayList<Advisor>();
        try {
            DocumentReference reference = firestore.collection("people").document("advisors");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("advisors");

            if (bilkentID == null) {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    advisors.add(Advisor.fromMap((Map<String, Object>) entry.getValue()));
                }
            } else {
                if (data.containsKey(bilkentID)) {
                    advisors.add(Advisor.fromMap((Map<String, Object>) data.get(bilkentID)));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch advisors from database.");
        }
        return advisors;
    }
    public List<Coordinator> fetchCoordinators(String bilkentID) {
        List<Coordinator> coordinators = new ArrayList<Coordinator>();
        try {
            DocumentReference reference = firestore.collection("people").document("coordinators");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("coordinators");

            if(bilkentID == null) {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    coordinators.add(Coordinator.fromMap((Map<String, Object>) entry.getValue()));
                }
            } else {
                if (data.containsKey(bilkentID)) {
                    coordinators.add(Coordinator.fromMap((Map<String, Object>) data.get(bilkentID)));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch coordinators from database.");
        }
        return coordinators;
    }
    public List<Director> fetchDirectors(String bilkentID) {
        List<Director> directors = new ArrayList<Director>();
        try {
            DocumentReference reference = firestore.collection("people").document("directors");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("directors");

            if (bilkentID == null) {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    directors.add(Director.fromMap((Map<String, Object>) entry.getValue()));
                }
            } else {
                if (data.containsKey(bilkentID)) {
                    directors.add(Director.fromMap((Map<String, Object>) data.get(bilkentID)));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch directors from database.");
        }
        return directors;
    }

    public Advisor fetchAdvisorForDay(DayOfWeek day) {

        try {

            List<Advisor> advisors = fetchAdvisors(null);
            for (Advisor advisor : advisors) {
                if (advisor.getResponsibleFor().equals(day)) {
                    return advisor;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check if user exists in database.");
            return null;
        }

        return null;
    }

    public boolean addUser(User user) {
        String document = "";
        document = user instanceof Guide ? "guides" : document;
        document = user instanceof Advisor ? "advisors" : document;
        document = user instanceof Coordinator ? "coordinators" : document;
        document = user instanceof Director ? "directors" : document;
        DocumentReference reference = firestore.collection("people").document(document);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            data.putIfAbsent(user.getBilkent_id(), user);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {
            }));

            System.out.println("User [" + user.getBilkent_id() + "] added to database." + result.get().getUpdateTime());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add user to database.");
            return false;
        }
    }

    public boolean updateUser(User user) {
        String document = "";
        document = user instanceof Guide ? "guides" : document;
        document = user instanceof Advisor ? "advisors" : document;
        document = user instanceof Coordinator ? "coordinators" : document;
        document = user instanceof Director ? "directors" : document;
        DocumentReference reference = firestore.collection("people").document(document);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            data.put(user.getBilkent_id(), user);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {
                            }));

            System.out.println("User [" + user.getBilkent_id() + "] updated." + result.get().getUpdateTime());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update user.");
            return false;
        }
    }
}
