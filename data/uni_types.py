import requests
import re
from bs4 import BeautifulSoup
from datetime import datetime
from utils import get_request_with_retry
class University:
    def __init__(self, university_type, name, id, url):
        self.university_type = university_type
        self.name = name
        self.id = id
        self.url = url
        self.departments = []
        self.city = None # Default to None

        # Fetch the university page
        response = get_request_with_retry(self.url)
        if response != None and response.status_code == 200:
            response.encoding = 'utf-8'
            page_content = response.text
            
            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(page_content, 'html.parser')
            
            # Find all department links in the specified structure
            panels = soup.find_all('div', class_='panel panel-primary')

            for panel in panels:
                link_tag = panel.find('a')
                if link_tag and 'href' in link_tag.attrs:
                    href = link_tag['href']
                    match = re.search(r"y=(\d+)", href)
                    # Find the department name inside the <div> element
                    department_name_div = link_tag.find('div')
                    department_name = department_name_div.text.strip() if department_name_div else 'N/A'
                    if ("(%25 İndirimli)" in department_name):
                        scholarship = "%25"
                        department_name = department_name.replace(" (%25 İndirimli)", "")
                    elif ("(%50 İndirimli)" in department_name):
                        scholarship = "%50"
                        department_name = department_name.replace(" (%50 İndirimli)", "")
                    elif ("(%75 İndirimli)" in department_name):
                        scholarship = "%75"
                        department_name = department_name.replace(" (%75 İndirimli)", "")
                    elif ("(Burslu)" in department_name):
                        scholarship = "%100"
                        department_name = department_name.replace(" (Burslu)", "")
                    elif ("(Ücretli)" in department_name):
                        scholarship = "%0"
                        department_name = department_name.replace(" (Ücretli)", "")
                    else:
                        scholarship = "N/A"
                    
                    self.departments.append(Department(department_name, match.group(1), scholarship))

            self.city = self.departments[0].getUniCity()        
            print("Created university object for", self.name)
        else:
            print(f"Failed to retrieve the university page for ID {self.id}. Status code: {response.status_code}")
    def to_dict(self):
        return {
            'university_type': self.university_type,
            'name': self.name,
            'id': self.id,
            'url': self.url,
            'city': self.city,
            'departments': [dept.to_dict() for dept in self.departments]
        }
    
class Department:
    def __init__(self, name, id, scholarship):
        self.name = name
        self.id = id
        self.years = []
        self.scholarship = scholarship

        # Fetch the available years for the department
        for year in range(2019, datetime.now().year):
            response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/{year}/content/lisans-dynamic/1060.php?y={self.id}")
            if response != None and response.status_code == 200:
                response.encoding = 'utf-8'
                self.years.append(Year(year, self.id))

        self.years.append(Year("", self.id)) # Add the current year as well, but the URL will not have a year parameter 

    def getUniCity(self):
        response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/lisans.php?y={self.id}")
        if response is not None and response.status_code == 200:
            response.encoding = 'utf-8'
            soup = BeautifulSoup(response.text, 'html.parser')
            header = soup.find('h3', {'class' :'panel-title pull-left'})
            if header:
                header_text = header.get_text(strip=True)
                match = re.search(r"\(([^)]+)\)", header_text)
                if match:
                    uniCity = match.group(1).strip()
        if uniCity is None:
            print(f"City not found for Department ID: {self.id}")
            print(f"response: {response.text}")
        return uniCity

    def to_dict(self):
        return {
            'name': self.name,
            'id': self.id,
            'scholarship': self.scholarship,
            'years': [year.to_dict() for year in self.years]
        }
        
class Year:
    def __init__(self, year, id):
        self.id = id
        self.year = year
        self.hs_data = []
        self.table_data = {}
        self.city_data = {}

        # Fetch high school information
        if(self.year == ""):
            response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/content/lisans-dynamic/1060.php?y={self.id}")
        else:
            response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/{self.year}/content/lisans-dynamic/1060.php?y={self.id}")
        if response != None and response.status_code == 200:
            response.encoding = 'utf-8'
            page_content = response.text    
            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(page_content, 'html.parser')

            # Find all table rows within the body of the table
            rows = soup.find('tbody').find_all('tr')

            # Extract the school names and associated values from each row
            for row in rows[1:]:  # Skip the first row as it contains summary data
                columns = row.find_all('td')
                school_name = columns[0].text.strip()
                total = int(columns[1].text.strip()) if columns[1].text.strip() != "---" and columns[1].text.strip() != "" else 0
                new_graduates = int(columns[2].text.strip()) if columns[2].text.strip() != "---" and columns[2].text.strip() != "" else 0
                previous_graduates = int(columns[3].text.strip()) if columns[3].text.strip() != "---" and columns[3].text.strip() != "" else 0
                
                # Append the data as a tuple (or dictionary, if you prefer)
                self.hs_data.append({
                    'school': school_name,
                    'total': total,
                    'new_graduates': new_graduates,
                    'previous_graduates': previous_graduates
                })
                
        else:
            print(f"Failed to retrieve the high school data for ID {self.id}. Status code: {response.status_code}. URL was {response.url}")
        
        # Fetch general information about department
        if(self.year == ""):
            response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/content/lisans-dynamic/1000_1.php?y={self.id}")
        else:
            response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/{self.year}/content/lisans-dynamic/1000_1.php?y={self.id}")
        if response != None and response.status_code == 200:
            response.encoding = 'utf-8'
            page_content = response.content

            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(page_content, "html.parser")
            
            for row in soup.select('table.table-bordered tbody tr'):
                cells = row.find_all('td')
                if len(cells) == 2:
                    key = cells[0].get_text(strip=True)
                    value = cells[1].get_text(strip=True)
                    self.table_data[key] = value

        else:
            print(f"Failed to retrieve the general department data for ID {self.id}. Status code: {response.status_code}. URL was {response.url}")

        # Fetch the cities where the students are from
        if(self.year == ""):
            response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/content/lisans-dynamic/1020c.php?y={self.id}")
        else:
            response = get_request_with_retry(f"https://yokatlas.yok.gov.tr/{self.year}/content/lisans-dynamic/1020c.php?y={self.id}")
        if response != None and response.status_code == 200:
            response.encoding = 'utf-8'
            page_content = response.content

            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(page_content, "html.parser")
            # Find the table
            table = soup.find('table', {'class': 'table-bordered'})

            # Extract rows from the table body
            rows = table.find('tbody').find_all('tr')
            for row in rows:
                cells = row.find_all('td')
                province = cells[0].get_text(strip=True)
                student_count = cells[1].get_text(strip=True)
                percentage = cells[2].get_text(strip=True)

                self.city_data[province] = {
                    'student_count': student_count,
                    'percentage': percentage
                }
                
        else:
            print(f"Failed to retrieve the city data for ID {self.id}. Status code: {response.status_code}. URL was {response.url}")
    def to_dict(self):
        if(self.year == ""):
            self.year = datetime.now().year
        return {
            'id': self.id,
            'year': self.year,
            'hs_data': self.hs_data,
            'table_data': self.table_data,
            'city_data': self.city_data
        }