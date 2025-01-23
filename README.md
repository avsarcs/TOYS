# Bilkent TOYS (Tanıtım Ofisi Yönetim Sistemi)
![GitHub Release](https://img.shields.io/github/v/release/avsarcs/TOYS)

## Team
@begumfilizoz
@cantucer
@avsarcs
@rusenaliyilmaz
@steins-ut
@oegecelik

## Description
Bilkent TOYS is a system for guides, advisors, coordinators and directors to communicate, plan and participate in university tours and fairs submitted by high school councelors or students.
## Features
### Form Application Interface for highschools to apply for tours
Highschools can apply through the platform, in which they choose their highschool from a list, choose their timeslot, give their contact information and information about how many students are coming.
### Interface for advisors to manage tours and assign guides
When councelors apply for a tour, advisors choose which tours to accept, and for which timeslot. A guide match algorithm will match the available guides to tours based on their majors and the high schools that they graduated from.
### Guide Interface for guides to join tours and keep track of tours
Guides can apply to be a guide for a specific tour through the interface. They also keep track of their timetables, lectures, and can indicate when they start and end the tours.
### Interface for coordinator to oversee the whole process
The coordinator can promote guides to become advisors, and manage their hourly payment. The coordinator can also process fair applications and assign guides to them.
### Data analytics interface to analyze performance of guides and high schools
Through data analytics, historical data for students who came to Bilkent, which city and highschool they come from, and their rankings will be observed.
There will be highschool specific pages that show statistics, how many students attended a tour, how many students were in the highschool, and how many came to Bilkent. The head can also view how Bilkent compares against it's rivals, how many chose Bilkent and how many chose rivals.
### A Comprehensice Review System
Tour attendees can review guides and tours, and through an interface old reviews will be viewable.
## Build Instructions

### Front-End Build Instructions

1. Clone the repo to a folder. The GitHub repo can be found through this link: [https://github.com/avsarcs/TOYS](https://github.com/avsarcs/TOYS). When the green **Code** button is clicked, different instructions to clone the repo will be given, based on the way you wish to clone the repo.  
2. Change directory (`cd`) to the `toys-frontend` directory.  
3. Run the `npm install` command. Wait for the installation to complete.  
4. Run the `npm run build` command to build.  
5. Run `npm run preview` to run the build in localhost.  
6. Visit the URL `localhost:4173` in your browser to view the front-end.  

### Back-End Build Instructions

1. Our dependency for the back-end database is Firebase Firestore. First, create a Firebase account. Create a project. Follow the regular guidelines for these steps.  
2. Structure the database according to the `database_dbs` (database structure) file.  
3. Create a service account and get the required credentials.  
4. Move the relative credentials file into the `resources` folder and rename it `googlecreds.json`.  
5. Download the necessary Maven packages and dependencies using the IDE.  
6. Build the package with a predefined Maven clean lifecycle step.  
7. Run the Python script scraper files in the `data` folder to get high school and university data.  
8. Rename the `İhsanDoğramacıBilkentUniversity` JSON file to `bilkent.json`.  
9. Run the `combine.py` Python script to unify the data into a single JSON file.  
10. Move this JSON file to the relative path `./data/universities.json` of the JAR package.  
11. Run `toys.jar`.  
