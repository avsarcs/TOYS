package server.models.time;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@JsonSerialize(using = ZTimeSerializer.class)
@JsonDeserialize(using = ZTimeDeserializer.class)
public class ZTime {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime date;

    public boolean equals(ZTime other) {
        return this.date.isEqual(other.date);
    }

    public ZTime() {
    }
    public ZTime(ZonedDateTime date) {
        this.date = date;
    }
    public ZTime(String s) {
        this.date = ZonedDateTime.parse(s);
    }

    public static List<ZTime> fromList(List<ZonedDateTime> list) {
        return (list.stream().map(ZTime::new).toList());

    }

    public static ZTime fromMap(Map<String, Object> map) {
        return new ZTime()
            .setDate(ZonedDateTime.parse((String) map.get("date")));
    }

    public static boolean overlap(ZTime start1, ZTime start2, ZTime end1, ZTime end2) {
        if (start2.getDate().isAfter(end1.getDate())) {
            return false;
        }
        if (start1.getDate().isAfter(end2.getDate())) {
            return false;
        }
        return true;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public boolean inRange(ZTime other, int hourOffset) {
        //TODO: proof check this
        return this.date.isAfter(other.date.minusHours(hourOffset)) && this.date.isBefore(other.date.plusHours(hourOffset));
    }

    public ZTime setDate(ZonedDateTime date) {
        this.date = date;
        return this;
    }
}
