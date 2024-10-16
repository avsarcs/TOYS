# Non-function Requirements of TOYS

## Performance
TOYS system is a software product with many features and many users. It will hence contain a large database with a lot of information. Many guides, advisors, students, and school counselors will be able to use it, so the system will hold all of their information and statistics. TOYS will also include information about various high schools. When software systems include large databases, their performance can be impacted negatively. Therefore, the system must find ways to efficiently pull and filter required data from the database in order to maximize performance. 

## Ease of Use
As mentioned, the system has a lot of users with various backgrounds. Therefore, it is important to create UI/UX that will be easy to use for each and every user. The system should not be too complicated and navigation between different features of the app should be easy and practical. For example, a student should easily navigate to individual tour request pages, a guide should easily navigate to tour management pages, a counselor should easily be able to request school tours, and an advisor should easily see and manage their tours, etc. Thus, a practical front-end structure is significant for the web application. 

## Reliability
A reliable system is free of bugs and handles errors well. Since TOYS will be a system with many features and many users, there are a lot of user-system interactions. For each of these interactions, thorough tests should be carried out to identify possible exceptions and handle them properly. For example, a numeric field should not be accepting chars, or a counselor should not be allowed to request a tour at a date that is in the past. All of these edge cases should be thought of and necessary precautions to handle them should be taken. In addition, many users may use the system at the same time. The system should not crash in such a case, or cause long waiting times, so efficiency and concurrency should be prioritized. For example, the system should be able to run multiple processes simultaneously.

## Security
The system should protect itself and its important data from potential attackers. TOYS is a system with a lot of sensitive information: high school information, tour details, success rate of tours (in terms of how effective they were in convincing students to choose Bilkent) etc., so it should protect this information very well with encryption during transmit and establish trust in users with their data. The system should also protect users' personal information (such as their phone number and other means of contact) with authentication and involve a secure login/ signup interface.  

## Maintainability
Software systems should be designed for long-term use and TOYS should also be designed in a way that allows users to access it for a long time. Well-documented code can be recovered easily, so TOYS should be documented well. A clean and clear architecture should be implemented for it, so that recovering the software when needed is easy and not time-consuming.

## Verifiability
The system should be accessed only by users that are supposed to access it, so the system should verify any user that is trying to log in. For example, someone who is not a registered guide should not have access to tour information and alter it. Or someone who is not an advisor/ coordinator should not be allowed to approve/deny tours. These controls are necessary for a verifiable software.

## Compatibility
Different browsers should support our system and the system should also work on phones. We chose tools that support cross-platform usage, for example, React allows cross-platform development. This choice allows users to open the system on any browser and device based on their preference.  

## Responsiveness
The layout of the page and how features are accessed will be dynamic based on the platform/ device the website is opened in. For instance, it would be hard to use a website designed for web usage on a phone, with small texts and features that are not be supported. Therefore, the appearance of the page should be designed to change based on the conditions that it is being used in.
