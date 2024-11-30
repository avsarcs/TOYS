package server.models.time;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.ZonedDateTime;

public class ZTimeDeserializer extends JsonDeserializer<ZTime> {
    @Override
    public ZTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) {
        try {
            String date = jsonParser.getValueAsString();
            if (date == null) {
                return null;
            }
            return new ZTime(ZonedDateTime.parse(date));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
