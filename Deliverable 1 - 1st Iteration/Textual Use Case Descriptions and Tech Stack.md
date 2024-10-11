# Use Cases
There are 8 different user personas that will be utilizing our software.
These user personas and their use cases are listed as follows.

## Applicant

This user persona includes highschool counselors and (group of) highschool students that apply for a tour in the campus.

### Applicant Use Cases

An applicant may
- *Invite Bilkent to a fair*: An applicant will be able to fill a form on a dedicated page to invite Bilkent members to a career (or otherwise) fair happening at their school. The applicant will include all the relevant details about the fair (city, highschool, date) and their contact information (email and phone number) on this form.
- *Apply for a tour*: An applicant will be able to fill a form on a dedicated page to apply for a tour of the Bilkent campus. The form will require all the relevant details including the number of students to visit the campus, contact information of the applicant, several dates that they are available and a free-form text field about their expectations from the tour.
- *Send tour review*: After the tour is over, the applicant and, if we have their emails, the students that attended the tour will receive an email that opens to a link with a review form. In the review form, they will be able to rate the tour out of a certain score and express their opinions in a free-form text field.
- *Request a tour detail change*: After an Applicant sends a tour application, they will be able to view their application and notify / request a change in any of the details e.g. the number of visiting students and / or available dates.
- *Receive updates on tour status*: After an Applicant sends a tour application, they will receive notifications in their email about whether their toru application was confirmed, rejected, or changes were requested by the Advisor.

## Prospective Volunteer

This user persona includes the Bilkent university students who are not yet qualified as an (amateur) guide but who wish to apply to become so.

### Prospective Volunteer Use Cases

- *Apply to become a guide*: Any Bilkent student is able to apply to become a guide by filling a form on a dedicated page that requires name, surname, department information alongside their motivations for becoming a guide.
## Authorized Member

This user persona is a generalization of Coordinator, Amateur Guide, Guide and Advisor. The use cases of the Authorized Member describes the use cases for all these user personas.

### Authorized Member Use Cases

- *View tour review scores*: Any Authorized Member can see the score ratings of any completed tour that were given by the tour Applicant and, if we have their emails, students who attended the tour.
- *View attended tours' textual reviews*: Authorized Members (which include Guides, Amateur Guides and Advisors) can see the textual reviews given to them by the Applicant of the tour and the students that attended the tour. These textual reviews are hidden to other guides, but available to Coordinators.
- *Login to the system:* Any Authorized Member can login to the web application for the system to recognize them.
- *View tour and fair info*: Every Authorized Member can view information about tours and fairs, while doing changes depends on which persona is viewing the page.
- *Update profile*: Every Authorized Member has a profile page, and are allowed to update it as they see fit. The profile has both personal information and other information like the member's schedule to ensure the service can function correctly.
## Amateur Guide

This user persona describes the newly registered Guide who is automatically designated as "amateur" until an Advisor promotes them to a regular Guide by deleting that label.
### Amateur Guide Use Cases

- *Register to tag along another guide*: According to their schedule and the tour's availability, an Amateur Guide can arbitrarily reserve a tour to tag along from the application interface.

## Guide

This user persona is a generalization of Advisors and describes a Guide who has moved on from being an amateur and is now fully permitted to take part in tours.
### Guide Use Cases

- *Assign themselves to a tour*: A guide can assign any tour to themselves that can fit in their schedule and still has space for guides without requiring any confirmation from anyone else.
- *Accept / reject a tour assigned by an advisor*: An Advisor may, if the Guide's schedule allows for it, assign a tour for a certain guide to handle. A guide may accept or cancel their assignment at their own discretion.
- *Apply to become an advisor*: A guide can apply to become an advisor by filling a form on a dedicated page entering all required information.
- Report the beginning and end of a tour: At the start and end of a tour, a Guide reports to the system to ensure proper data collection and make sure the next tours can move on without a hitch.

## Advisor

This user persona describes a volunteer who is responsible for managing tour applications, tours themselves and guides. Since Guide is a generalization of this persona, an Advisor has the use cases of a Guide too.
### Advisor Use Cases

- *Request and manage tour detail changes from / to tour applicants*: An Applicant or an Advisor themselves may want to make changes on the details of a tour. The Advisor is responsible for getting in touch with the client and ensuring communication.
- *Assign themselves to be a guide*: Since every Advisor is also a Guide, if the Advisor sees fit they can assign themselves to be a guide on a tour on the day they are responsible for.
- *Assign a guide to a tour*: An Advisor is allowed to assign a Guide to a tour, provided that there is space in the tour and that the Guide's time table is free. The assignments are not forced and a Guide may decline.
- *Accept / reject tour applications*: After an Applicant sends a tour application, an Advisor is responsible for accepting or rejecting that tour application at their own discretion.
- *Change tour details*:  The advisor has permission to change tour details that are already in the system and has not happened yet. Note that making changes does not necessitate communication between the Applicant and the Advisor.
- *Update "experience level" of guides*: Every Guide's profile will include their experience level. To minimize misinformation, an Advisor may manually adjust the experience level of a Guide.

## Coordinator

This user persona describes an official of higher authority than the Advisor who is responsible for overseeing the smooth ongoing of operations without being very involved in the details.

### Coordinator Use Cases

*Accept / reject (amateur) guide and advisor applications*: Coordinator arbitrates whether an applicant for a guide or an advisor role is worthy enough to bestow the title.

*Invite guides to fairs*: Given some career (or otherwise) fairs that some highschools invited Bilkent to, Coordinator can invite Guides to attend that fair.

*Delete guides / advisors*: The Coordinator makes the decisions about whether a Guide or an Advisor is worthy enough to keep their title, and have an account in the system. They can also delete the accounts of Guides and Advisors that have left the Holy House of the Tour Guides of Bilkent, to venture upon further spiritual journeys in life, having matured evergreatly in their trials of babysitting highschoolers.

*Accept / reject fair invitations*: Coordinators decide whether or not a fair that Bilkent has an invitation for will be attended.

*View review details*: Coordinators can view reviews of every tour, including both the score and the textual reviews.

*View the hours of work done by guides*: Coordinators need to determine how much they will pay each Guide so they can view the hours of work done by each guide and during which tours this work was done.
## Director

Director has the highest authority in the system whose sole purpose is to make sure that this system is serving its bottomline of converting potential high-value Bilkent students, and enacting systemic changes if their monitoring of the performance indicates any declines.

### Director Use Cases

*View detailed data analytics about highschools*: Director will be able to view data about which highschool has visited Bilkent in what frequency and how successful those tours turned out.

*View the performance level of guides*: Director will be able to view whether a Guide is meeting expectations based on performance estimation calculated via the reviews of tours that that Guide has led, and the number of hours worked, alongside months / years of experience.

*View information on how Bilkent compares to other schools*: Utilizing data scraped from YÖK's website, the system will be able to present the Director whether Bilkent is consistently obtaining the best students in the country overall and if not, to which universities it is losing to.

# Tech Stack

## Front-end

**React:** We picked React because of its popularity in the tech market and that experience with it could help us become relevant in the tech market later on. Furthermore, React enables a good workflow for working with a team since everyone can write separate, modular React components and they can be brought together in the same application. The modular structure of the components and all of them having local variables of their own lends itself good to thinking like they are classes; hence React lends itself more easily to an object oriented approach.

**Typescript:** React can work with either Javascript or Typescript. We chose Typescript because by catching type errors in compile time, we could save ourselves time in writing tests and avoid runtime errors that are hard to find.

**Mantine UI**: This is the ready-made component library that we will use. We use this library in order to not "reinvent the wheel"; by using and customizing Mantine UI's components, we will be able to save a lot of time. Since Mantine UI is not a very popular component library like Bootstrap, we decided it would contribute to a unique look in our front-end.

## Data Analytics
For the data analytics of our project, we will mainly use Python. For the guide-matching algorithm, we will use libraries such as Pandas and Numpy. Pandas library provides Dataframes and their related methods, which are helpful in manipulating and managing large amounts of data efficiently. Similarly, NumPy involves functionality to carry out advanced mathematical operations on large amounts of data with many fields. Matplotlib may be used for the visualization of graphs and tables, and Scikit-learn may be for various algorithms like guide-matching.

## Back-end

Java + Spring: Java is used because of it's ease of deployment through JAR files and my (Ruşen Ali Yılmaz, the back-end developer of our team) familiarity to it. Spring/Springboot is used to host the API services of the project. It was chosen because it provides necessary functionality through annotation, reduces boilerplate code, and has a wide range of libraries and extensions that we can use in need.