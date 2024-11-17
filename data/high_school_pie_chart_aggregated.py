import json

with open("high_school_pie_chart_data.json", "r") as file:
    data = json.load(file)

def simplify_department_name(department_name):
    if "(" in department_name:
        return department_name.split("(")[0].strip()
    return department_name

combined_data = {}

for high_school, year_data in data.items():
    combined_data[high_school] = {}
    for year, departments in year_data.items():
        aggregated_departments = {}

        for department_name, values in departments.items():
            simplified_name = simplify_department_name(department_name)

            if simplified_name not in aggregated_departments:
                aggregated_departments[simplified_name] = {"Count": 0, "Percentage": 0}

            aggregated_departments[simplified_name]["Count"] += values["Count"]
        total_students = sum(d["Count"] for d in aggregated_departments.values())
        for dept_name, dept_data in aggregated_departments.items():
            dept_data["Percentage"] = (dept_data["Count"] / total_students) * 100

        combined_data[high_school][year] = aggregated_departments

with open("high_school_pie_chart_aggregated_data.json", "w") as file:
    json.dump(combined_data, file, indent=4, ensure_ascii=False)

#print(json.dumps(combined_data, indent=4, ensure_ascii=False))
