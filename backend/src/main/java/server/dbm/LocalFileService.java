package server.dbm;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class LocalFileService {
    public void unlock() {
        lock.set(false);
    }

    static AtomicBoolean lock = new AtomicBoolean(false);
    public boolean saveMap(String file, Map<String, Object> content) {
        while (!lock.compareAndSet(false, true)) {}
        // Save the content to the file

        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file))) {
            oos.writeObject(content);
            System.out.println("Map has been saved to " + file);
        } catch (Exception e) {
            System.err.println("Error saving map to file: " + e.getMessage());
            return false;
        }

        lock.compareAndSet(true, false);
        return true;
    }

    public Map<String, Object> loadMap(String file) {
        // Load the content from the file
        while (lock.get()) {}
        ObjectMapper objectMapper = Database.getObjectMapper();
        Map<String, Object> jsonMap = Map.of();

        try {
            jsonMap = objectMapper.readValue(new File(file), Map.class);
            System.out.println("JSON file has been successfully loaded from " + file);
        } catch (Exception e) {
            System.err.println("Error reading JSON file: " + e.getMessage());
            return Map.of();
        }

        return jsonMap;
   }
}
