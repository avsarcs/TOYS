import json

with open("bilkent_data.json", "r") as file:
    bilkent_data = json.load(file)

high_school_data = {}

for department in bilkent_data["departments"]:
    department_name = department["name"]

    for year_data in department["years"]:
        year = year_data["year"]

        for hs_entry in year_data["hs_data"]:
            high_school_name = hs_entry["school"]
            total_students = hs_entry["total"]

            if high_school_name not in high_school_data:
                high_school_data[high_school_name] = {}

            if year not in high_school_data[high_school_name]:
                high_school_data[high_school_name][year] = {}

            if department_name not in high_school_data[high_school_name][year]:
                high_school_data[high_school_name][year][department_name] = 0

            high_school_data[high_school_name][year][department_name] += total_students

final_data = {}
for high_school, year_data in high_school_data.items():
    final_data[high_school] = {}
    for year, departments in year_data.items():
        total_students = sum(departments.values())
        department_percentages_and_counts = {
            department: {
                "Percentage": (count / total_students) * 100,
                "Count": count
            }
            for department, count in departments.items()
        }
        final_data[high_school][year] = department_percentages_and_counts

with open("high_school_pie_chart_data.json", "w") as file:
    json.dump(final_data, file, indent=4, ensure_ascii=False)

# Print for verification
#print(json.dumps(final_data, indent=4, ensure_ascii=False))



