package server.dbm;

import java.util.HashMap;
import java.util.Map;

public class MemCache {
     static Map<String, Object> cache;

     static void init() {
         cache = new HashMap<>();
     }

     public static Object load(String key) {
         if (!cache.containsKey(key)) {
             return null;
         }
         return cache.get(key);
     }

     public static Object save(String key, Object value) {
         cache.put(key, value);
         return value;
     }

     public static Map<String, Object> loadMap(String key) {
         if (!cache.containsKey(key)) {
             return null;
         }
         try {
            return (Map<String, Object>) cache.get(key);
         } catch (Exception e) {
             return null;
         }
     }

     public static void invalidate(String key) {
         if (cache.containsKey(key)) {
             cache.remove(key);
         }
     }

     public static boolean isValid(String key) {
            return cache.containsKey(key);
     }
}
