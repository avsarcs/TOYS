import json
import re

with open("bilkent_data.json", "r") as file:
    university_data = json.load(file)

def extract_city(school_name):
    match = re.search(r"\(([^-]+)", school_name)
    return match.group(1).strip() if match else "Unknown"

for department in university_data["departments"]:
    for year_data in department["years"]:
        city_totals = {}

        for hs_entry in year_data["hs_data"]:
            city = extract_city(hs_entry["school"])
            city_totals[city] = city_totals.get(city, 0) + hs_entry["total"]

        year_data["hs_data"] = [{"city": city, "total": total} for city, total in city_totals.items()]

# Save the modified JSON
with open("aggregate_cities_data.json", "w") as file:
    json.dump(university_data, file, indent=4, ensure_ascii=False)

# Print for verification
#print(json.dumps(university_data, indent=4, ensure_ascii=False))
