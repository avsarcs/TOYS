import requests
import json
from bs4 import BeautifulSoup
from uni_types import University

# URL of the page to fetch
main_url = "https://yokatlas.yok.gov.tr/lisans-anasayfa.php"

# Fetch the HTML content from the web
response = requests.get(main_url)

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
                university_list.append((uni_name, optgroup_label, uni_id, base_univ_url + uni_id))
        return university_list
    
    # Get the university list for both public and private universities
    universities = [University(*uni_fields) for uni_fields in extract_universities('Devlet Üniversiteleri')]
    universities.extend([University(*uni_fields) for uni_fields in extract_universities('Vakıf Üniversiteleri')])
    universities = [uni.to_dict() for uni in universities]
    with open('data.json', 'w') as json_file:
        json.dump(universities, json_file, indent=4)
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
