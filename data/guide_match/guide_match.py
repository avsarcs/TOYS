import json
from models import Guide, Highschool, guide_from_dict
import re

def find_guide_match(guides, school):
    guide_points = {}
    for guide in guides:
        experience = 0
        match = re.match(r"(\d+)", guide.experience)
        if match:
            experience = int(match.group(1))
        if guide.highschool.id == school.id:
            guide_points[guide] = 10
        else:
            guide_points[guide] = 0
        if guide.highschool.location.split(" /")[0].strip().lower() == school.location.split(" /")[0].strip().lower():
            guide_points[guide] += 5
        if school.priority <= 10:
            if experience >= 2:
                guide_points[guide] += 5
        elif school.priority <= 20:
            if experience == 1:
                guide_points[guide] += 5
        else:
            if experience == 0:
                guide_points[guide] += 5
    sorted_guide_points = dict(sorted(guide_points.items(), key=lambda item: item[1], reverse=True))
    return sorted_guide_points

# Load JSON data
with open("guides.json", "r") as f:
    guides_json = json.load(f)

with open("school.json", "r") as f:
    school_json = json.load(f)

print("Guides JSON:", guides_json)
print("School JSON:", school_json)
# Convert JSON to objects
guides = [guide_from_dict(guide) for guide in guides_json]
school = Highschool.from_dict(school_json)

# Find and display matching guides
matching_guides = find_guide_match(guides, school)
for guide, points in matching_guides.items():
    print(f"Guide: {guide.fullname}, Points: {points}")
