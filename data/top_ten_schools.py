import json
import re

top_ten_schools_map = {}
top_ten_schools_map = {"KABATA\u015e": 1, "\u0130STANBUL ERKEK L\u0130SES\u0130": 1, "GALATASARAY \u00dcN\u0130VERS\u0130TES\u0130 GALATASARAY L\u0130SES\u0130": 2, "ANKARA FEN L\u0130SES\u0130": 3, "\u0130ZM\u0130R FEN L\u0130SES\u0130": 4, "\u0130STANBUL ATAT\u00dcRK FEN L\u0130SES\u0130": 5, "CA\u011eALO\u011eLU ANADOLU L\u0130SES\u0130": 6, "\u00c7APA FEN L\u0130SES\u0130": 7, "TOFA\u015e FEN L\u0130SES\u0130": 8, "ADANA FEN L\u0130SES\u0130": 9, "H\u00dcSEY\u0130N AVN\u0130 S\u00d6ZEN ANADOLU L\u0130SES\u0130": 10}

with open("bilkent_data.json", "r") as file:
    university_data = json.load(file)


filtered_data = {}
for department in university_data["departments"]:
    department_name = department["name"]
    filtered_data[department_name] = {}

    for year_data in department["years"]:
        year = year_data["year"]

        filtered_high_schools = []

        for hs_entry in year_data["hs_data"]:
            high_school_name = hs_entry["school"]
            total_students = hs_entry["total"]

            for key, ranking in top_ten_schools_map.items():
                if key in high_school_name:
                    filtered_high_schools.append({
                        "school": high_school_name,
                        "total": total_students,
                        "ranking": ranking
                    })
                    break  

        if filtered_high_schools:
            filtered_data[department_name][year] = filtered_high_schools

with open("top_ten_schools_data.json", "w") as file:
    json.dump(filtered_data, file, indent=4, ensure_ascii=False)

# Print for verification
#print(json.dumps(filtered_data, indent=4, ensure_ascii=False))