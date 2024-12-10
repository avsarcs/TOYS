package server.models.time;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class ZTimeSerializer extends JsonSerializer<ZTime> {

    @Override
    public void serialize(ZTime zTime, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) {
        try {
            jsonGenerator.writeString(zTime.getDate().toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
