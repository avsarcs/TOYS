# Non-function Requirements of TOYS

## Performance
"Data" pages are defined as the pages that make requests to the "data" microservice. These pages display scraped and processed data that is large in volume. All the pages that do not interact with the "data" microservice are defined as "non-data" pages.

Non-data pages should take no longer than 1 second to fully load.

Data pages should take no longer than 6 seconds to fully load.

Create, Read, Update, Delete operations on the database on the Tour, Guide, Advisor, Coordinator and Head models should take less than 500 milliseconds when there are less than 100 concurrent users.

Create, Read, Update, Delete operations on the database on the Tour, Guide, Advisor, Coordinator and Head models should take less than 1 second when there are more than 100 concurrent users.

## Ease of Use
At least 80% of guides new to the app, after 10 minutes of unsupervised meddling, when asked whether they feel confident about using the system for registering to tours and communicating with Advisors and their other daily tasks, should answer "YES".

Applying to a tour should require redirection to no more than 3 pages.

The Head, after 8 minutes of unsupervised meddling with the data pages, should answer "YES" to the question "Do you understand the presented data?".

The Head, after 8 minutes of unsupervised meddling with the data pages, should answer "NO" to the question "Is there a way to layout this data for you that you would find more intuitive to understand?".

An Advisor should never mistakenly assign a Guide to a tour during which the Guide has a lesson.

The registration flow should be optimized and the steps to upload your lesson schedule should be made so obvious such that 90% of registered Guides to the system, within 3 days of registration, should have also uploaded their lesson schedule to the system.

Whenever there is a missing or incorrectly inputted field in any form of the app, there must be a textual warning such as "You did not enter your password" and a visual cue around the incorrect field (e.g. turning the field red).

The character limitations in long-form text fields of forms should be communicated clearly with a progress bar.

## Reliability
TOYS should be able to support 300 concurrent users -given the scale of the app, it is unlikely to have more than 300 concurrent users at a time.

Whenever a new tour request is sent, the new tour request should display on the Tours page within at most 1 minute.

Whenever a new Guide fills the registration form and hence applies for entrance into the system, Coordinator page on accepting or rejecting new guides should display this new application within at most 1 minute.

Whenever an Advisor changes the status of a Tour e.g. from "Awaiting Confirmation" to "Accepted" or "Rejected", this status change should be reflected on the Tour page within at most 10 seconds. Thereby, the time window for another Advisor to send a conflicting status change to the system should be shortened.


## Security and Verifiability
If a given IP address sends 30 applications to register as a Guide back to back, that IP address should be rate limited to 1 application per 3 minutes.

Any form submission with missing required fields or fields that are longer than 1000 characters or fields that contain unexpected special characters including "<", ">", "$", "~", "\" should receive warnings on the front-end and be filtered on the back-end with the usage of regular expressions to never be incorporated into any interactions with the database.

The scraping of YÖK Atlas in the Data microservice should be limited to 1 action per second to avoid getting banned.

After an end-user sends an application to become a Guide in the system, a Coordinator should ACCEPT this application before this Prospective Guide can enter the system.

Even if a Prospective Guide somehow circumvents safety measures and enters the system on the front-end, a Prospective Guide should not have been assigned ANY permissions for ANY CRUD operations on the database and the back-end should block such attempts.

## Maintainability
Documentation should cover all the API endpoints of both the back-end and the Data microservice.
Documentation should cover all the classes used, and the data formats for different models of the database -both formats as they are used in the back-end, and in the format of "transfer" after they lose the fields that will not be required in the front-end.

Pages and components and React hooks and styles should be modularly separated into their own files in the front-end.

## Compatibility
TOYS should look the same on Chromium browsers and Firefox alike.

TOYS should implement all data processing actions on the back-end to reduce the compute load on the front-end as in improving compatibility with older computers.

## Responsiveness
At least 9 out of 10 users of TOYS on mobile phones, when they are asked whether they find the user experience BAD, SATISFACTORY, or GREAT, should answer at least SATISFACTORY.

At least 9 out of 10 users of TOYS on desktop, when they are asked whether they find the user experience BAD, SATISFACTORY, or GREAT, should answer at least SATISFACTORY.