import json
import os
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup
from uni_types import University
from utils import get_request_with_retry

directory = "scraped_data"
os.makedirs(directory, exist_ok=True)
main_url = "https://yokatlas.yok.gov.tr/lisans-anasayfa.php"

# Function to fetch and save university data
def fetch_and_save_university(uni_fields):
    file_path = os.path.join(directory, f"{uni_fields[1]}.json")
    if os.path.exists(file_path):
        print(f"File {file_path} already exists. Skipping...")
        return

    uni = University(*uni_fields)
    uni_dict = uni.to_dict()

    with open(file_path, 'w', encoding='utf-8') as json_file:
        json.dump(uni_dict, json_file, indent=4, ensure_ascii=False)

# Function to extract universities

def extract_universities(soup, optgroup_label, base_univ_url):
    universities = soup.find('optgroup', {'label': optgroup_label})
    university_list = []
    if universities:
        for option in universities.find_all('option'):
            uni_name = option.text
            uni_id = option['value']
            university_list.append((optgroup_label, uni_name, uni_id, base_univ_url + uni_id))
    return university_list

def main():
    # Fetch the main page
    response = get_request_with_retry(main_url)

    if response.status_code != 200:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return

    page_content = response.text
    soup = BeautifulSoup(page_content, 'html.parser')

    base_univ_url = "https://yokatlas.yok.gov.tr/lisans-univ.php?u="

    # Extract universities for both public and private types

    # DELETE THIS LINE TO GET ONLY VAKIF UNIVERSITIES
    public_universities = extract_universities(soup, 'Devlet Üniversiteleri', base_univ_url)
    private_universities = extract_universities(soup, 'Vakıf Üniversiteleri', base_univ_url)

    all_universities = public_universities + private_universities

    # Use ThreadPoolExecutor to fetch university data concurrently
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(fetch_and_save_university, all_universities)

if __name__ == "__main__":
    main()
