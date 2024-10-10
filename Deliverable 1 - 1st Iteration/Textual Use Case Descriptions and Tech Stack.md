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

- *View review scores*: Any Authorized Member can see the score ratings of any completed tour that were given by the tour Applicant and, if we have their emails, students who attended the tour.
- *View textual reviews of the tours they themselves attended*: Authorized Members (which include Guides, Amateur Guides and Advisors) can see the textual reviews given to them by the Applicant of the tour and the students that attended the tour. These textual reviews are hidden to other guides, but available to Coordinators.
- *Login to the system:* Any Authorized Member can login to the web application for the system to recognize them.
## Amateur Guide

This user persona describes the newly registered Guide who is automatically designated as "amateur" until an Advisor promotes them to a regular Guide by deleting that label.
### Amateur Guide Use Cases

- *Register to tag along another guide*: According to their schedule and the tour's availability, an Amateur Guide can arbitrarily reserve a tour to tag along from the application interface.

## Guide

### Guide

## Advisor

### Advisor Use Cases

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