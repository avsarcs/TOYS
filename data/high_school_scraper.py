import requests
from bs4 import BeautifulSoup
import json
import time 

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
}

base_url = "https://www.epey.com/lise-tercih/{}/"

all_data = []

for page_num in range(1, 173):
    url = base_url.format(page_num)
    print(f"Scraping page {page_num}: {url}")

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")
    main_div = soup.find("div", id="listele")
    table_div = main_div.find("div", class_="listele table")
    if not table_div:
        print(f"Table not found on page {page_num}, skipping.")
        continue

    rows = table_div.find_all("ul", class_="metin row")

    for row in rows:
        title_tag = row.find("li", class_="adi cell").find("div", class_="detay cell").find("a", class_="urunadi")
        title = title_tag["title"] if title_tag else "N/A"

        location_tag = row.find("li", class_="adi cell").find("div", class_="detay cell").find("span", class_="degergetir")
        location = location_tag.get_text(strip=True) if location_tag else "N/A"

        details = {}
        for li in row.find_all("li", class_=lambda x: x and "ozellik" in x):
            value = li.get_text(strip=True)

            # Determine the label based on the class
            class_name = " ".join(li["class"])
            if "ozellik10271" in class_name or "ozellik cell" == class_name:
                label = "percentile"
            elif "ozellik10275" in class_name:
                label = "puan"
            elif "ozellik9586" in class_name:
                label = "duration"
            elif "ozellik9589" in class_name:
                label = "language"
            elif "ozellik10273" in class_name:
                label = "quota"
            else:
                label = "other" 

            details[label] = value

        # Organize extracted data in a dictionary
        row_data = {
            "title": title,
            "location": location,
            "details": details
        }

        all_data.append(row_data)

    time.sleep(1)  # 1-second delay 


with open("school_data_all_pages.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)

print("Data has been saved to school_data_all_pages.json")
