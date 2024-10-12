import requests
import re
from bs4 import BeautifulSoup
from datetime import datetime

class University:
    def __init__(self, university_type, name, id, url):
        self.university_type = university_type
        self.name = name
        self.id = id
        self.url = url
        self.departments = []

        # Fetch the university page
        response = requests.get(self.url)
        if response.status_code == 200:
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
                    self.departments.append(Department(department_name, match.group(1)))

        else:
            print(f"Failed to retrieve the university page for ID {self.id}. Status code: {response.status_code}")
    def to_dict(self):
        return {
            'university_type': self.university_type,
            'name': self.name,
            'id': self.id,
            'url': self.url,
            'departments': [dept.to_dict() for dept in self.departments]
        }
    
class Department:
    def __init__(self, name, id):
        self.name = name
        self.id = id
        self.years = []
        for year in range(2019, datetime.now().year):
            response = requests.get(f"https://yokatlas.yok.gov.tr/{year}lisans-dynamic/1060.php?y={self.id}")
            if response.status_code == 200:
                response.encoding = 'utf-8'
                self.years.append(Year(year, self.id))
        self.years.append(Year("", self.id)) # Add the current year as well, but the URL will not have a year parameter
    def to_dict(self):
        return {
            'name': self.name,
            'id': self.id,
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
            response = requests.get(f"https://yokatlas.yok.gov.tr/content/lisans-dynamic/1060.php?y={self.id}")
        else:
            response = requests.get(f"https://yokatlas.yok.gov.tr/{self.year}/content/lisans-dynamic/1060.php?y={self.id}")
        if response.status_code == 200:
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
                total = int(columns[1].text.strip())
                new_graduates = int(columns[2].text.strip())
                previous_graduates = int(columns[3].text.strip())
                
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
            response = requests.get(f"https://yokatlas.yok.gov.tr/content/lisans-dynamic/1000_1.php?y={self.id}")
        else:
            response = requests.get(f"https://yokatlas.yok.gov.tr/{self.year}/content/lisans-dynamic/1000_1.php?y={self.id}")
        if response.status_code == 200:
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
            response = requests.get(f"https://yokatlas.yok.gov.tr/content/lisans-dynamic/1020c.php?y={self.id}")
        else:
            response = requests.get(f"https://yokatlas.yok.gov.tr/{self.year}/content/lisans-dynamic/1020c.php?y={self.id}")
        if response.status_code == 200:
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
        return {
            'id': self.id,
            'year': self.year,
            'hs_data': self.hs_data,
            'table_data': self.table_data,
            'city_data': self.city_data
        }