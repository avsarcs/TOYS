package server.scraperModels;

import java.util.List;

public class DepartmentModel {
    public String name;
    public long id;
    public List<Year> years;

    public DepartmentModel(String name, long id) {
        this.name = name;
        this.id = id;
    }
}
