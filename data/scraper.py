# Description: This script scrapes the universities from the YÖK Atlas website and saves them as JSON files in the scraped_data directory.
import json
from bs4 import BeautifulSoup
from uni_types import University
from utils import get_request_with_retry
import os

directory = "scraped_data"
os.makedirs(directory, exist_ok=True)
# URL of the page to fetch
main_url = "https://yokatlas.yok.gov.tr/lisans-anasayfa.php"

# Fetch the HTML content from the web
response = get_request_with_retry(main_url)

# Check if the request was successful
if response.status_code == 200:
    page_content = response.text
    
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(page_content, 'html.parser')

    # Base URL for the university pages
    base_dep_url = "https://yokatlas.yok.gov.tr/lisans.php?y="
    base_univ_url = "https://yokatlas.yok.gov.tr/lisans-univ.php?u="

    # Extract universities under "Devlet Üniversiteleri" and "Vakıf Üniversiteleri"
    def extract_universities(optgroup_label):
        universities = soup.find('optgroup', {'label': optgroup_label})
        university_list = []
        if universities:
            for option in universities.find_all('option'):
                uni_name = option.text
                uni_id = option['value']
                university_list.append((optgroup_label, uni_name, uni_id, base_univ_url + uni_id))
        return university_list
    
    # Get the university list for both public and private universities

    for uni_fields in extract_universities('Devlet Üniversiteleri'):
        file_path = os.path.join(directory, uni_fields[1] + ".json")
        if os.path.exists(file_path):
            print(f"File {file_path} already exists. Skipping...")
            continue
        
        uni = University(*uni_fields)
        uni = uni.to_dict()

        #This appends the new university dictionary as a new json file in the directory
        with open(file_path, 'w') as json_file:
            json.dump(uni, json_file, indent=4)

    for uni_fields in extract_universities('Vakıf Üniversiteleri'):
        file_path = os.path.join(directory, uni_fields[1] + ".json")
        if os.path.exists(file_path):
            print(f"File {file_path} already exists. Skipping...")
            continue
        
        uni = University(*uni_fields)
        uni = uni.to_dict()

        with open(file_path, 'w') as json_file:
            json.dump(uni, json_file, indent=4)


else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
