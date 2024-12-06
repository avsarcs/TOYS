package server.models.review;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DTO_GuideOverall {
    private double average;
    private int count;
    private List<DTO_Review> reviews;


    public DTO_GuideOverall() {
    }
    protected DTO_GuideOverall(Map<String,Object> map) {
        this.average = (double) map.get("average");
        this.count = (int) map.get("count");
        this.reviews = new ArrayList<>();
        for (Object review : (List<Object>) map.get("reviews"))
        {
            this.reviews.add(DTO_Review.fromMap((Map<String, Object>) review));
        }
    }

    public double getAverage() {
        return average;
    }

    public DTO_GuideOverall setAverage(double average) {
        this.average = average;
        return this;
    }

    public int getCount() {
        return count;
    }

    public DTO_GuideOverall setCount(int count) {
        this.count = count;
        return this;
    }

    public List<DTO_Review> getReviews() {
        return reviews;
    }

    public DTO_GuideOverall setReviews(List<DTO_Review> reviews) {
        this.reviews = reviews;
        return this;
    }
}
