import json

# Load the JSON file
with open('all_high_schools_data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Modify the title field for each school
for item in data:
    city, district = item['location'].split(' / ')
    # Update the title with the new format
    item['title'] = f"{item['title'].split(' (')[0]} ({city} - {district})"

# Save the modified data back to the file
with open('all_high_schools_data.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("The title field has been updated successfully.")