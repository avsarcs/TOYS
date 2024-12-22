# Group Tour Model
```
{
	"tour_id": "tour id",
	"highschool": HighSchoolModel,
	"guides": [ { "id": "guide id", "full_name":"guide_name", "highschool": HighSchoolModel } ],
	"trainee_guides": [ { "id": "trainee_guide id", "full_name":"trainee_guide_name","highschool": HighSchoolModel } ],
	"type": "group", // or "individual" frontend will do conditional rendering based on this property
	"requested_times": ["2024-09-30T09:00:00Z+03:00", "2024-09-30T11:00:00Z+03:00"],
	"accepted_time": "2024-09-30T09:00:00Z+03:00",
	"visitor_count": 66,
	// changed # Done @ Dec 20 - 2306
	"status": "RECEIVED" | "TOYS_WANTS_CHANGE" | "APPLICANT_WANTS_CHANGE" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "ONGOING" | "FINISHED"
	"notes": "The notes for the tour added by the tour guide and the advisor.",
	"applicant": {
		"fullname": "TheNameOfTheApplicant1",
		"role": "management", // or "teacher"
		"email": "TheEmailOfTheApplicant1",
		"phone": "ThePhoneOfTheApplicant1",
		"notes": "Notes added by the applicant."
	},
	"actual_start_time": "2024-11-15T14:22:14Z+03:00",
	"actual_end_time": "2024-11-15T14:22:14Z+03:00",
	"classroom": "Mithat Çoruh"
}
```


# Group Tour Application Model
```
{
	"highschool": HighSchoolModel
	"requested_times": ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
	"visitor_count": 66,
	"applicant": {
		"fullname": "TheNameOfTheApplicant1",
		"role": "student", // or "teacher"
		"email": "TheEmailOfTheApplicant1",
		"phone": "ThePhoneOfTheApplicant1",
		"notes": "Notes added by the applicant."
	}
}
```

# Individual Tour Application Model
```
{
	"highschool": HighSchoolModel
	"requested_times": ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
	"requested_majors": [ "major1", "major2", "major3" ],
	"visitor_count": 4,
	"applicant": {
		"fullname": "TheNameOfTheApplicant1",
		"role": "student",
		"email": "TheEmailOfTheApplicant1",
		"phone": "ThePhoneOfTheApplicant1",
		"notes": "Notes added by the applicant."
	}
}
```

# Individual Tour Model

```
{
	"tour_id": "tour id",
	"highschool": HighSchoolModel
	"guides": [ {"id": "guide id", "full_name":"guide_name", "highschool": { "name": "Ankara Fen", "id": "999", "location": "Ankara", "priority": 1 } } ],
	"trainee_guides": [ { "id": "trainee_guide id", "full_name":"trainee_guide_name","highschool": { "name": "Ankara Fen", "id": "999", "location": "Ankara", "priority": 1 } } ],
	"type": "individual",
	"requested_times": ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
	"requested_majors": [ "major1", "major2", "major3" ],
	"accepted_time": "2024-09-30T09:00:00Z",
	"visitor_count": 4,
	// changed # Done @ Dec 20 - 2306
	"status": "RECEIVED" | "TOYS_WANTS_CHANGE" | "APPLICANT_WANTS_CHANGE" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "ONGOING" | "FINISHED"
	"notes": "The notes for the tour added by the tour guide and the advisor.",
	"applicant": {
		"fullname": "TheNameOfTheApplicant1",
		"email": "TheEmailOfTheApplicant1",
		"role": "roll",
		"phone": "ThePhoneOfTheApplicant1",
		"notes": "Notes added by the applicant."
	},
	"actual_start_time": "2024-11-15T14:22:14Z",
	"actual_end_time": "2024-11-15T14:22:14Z"
}
```


# Simple Event Model
```
{
    "event_type": "TOUR" | "FAIR"
	"event_subtype": "TOUR",
	"event_id": "id",
	// changed # Done @ Dec 20 - 2306
	"event_status": "RECEIVED" | "TOYS_WANTS_CHANGE" | "APPLICANT_WANTS_CHANGE" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "ONGOING" | "FINISHED" // changed # Done @ Dec 20 - 2306
	"highschool": HighSchoolModel
	// accepted_time field empty/null for tours *_WANTS_CHANGE
	"accepted_time": "2024-11-15T14:22:14Z",

!!!! CHANGED # Done @ Dec 20 - 2306
	"requested_times": ["2024-11-16T14:22:14Z", "2024-11-17T14:22:14Z"],
	"visitor_count": 34,
	"guides": [ {"id": "guide id", "full_name":"guide_name" ] ... ],
}
```


# Trainee Guide Application Model
```
{
  "fullname": "John Doe",
  "id": "12345678",
  "highschool": HighschoolModel
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "major": "COMPUTER_SCIENCE",
  "current_semester": 5,
  "next_semester_exchange": true,
  "how_did_you_hear": "Through university website",
  "why_apply": "To gain international experience"
}
```

# Highschool Model
{
	"id": "id of the highschool",
	"name": "Ankara Fen",
	"location": "Ankara",
	"priority": 1 (min. 1, max. 4),
	"ranking": 1
}

# Review Model
`tour_id` and `tour_date` fields are ALWAYS included.
`guide_id` and `guide_name` are included only if for=GUIDE
```
{
	"id": "id of the review"
	"for": "TOUR" | "GUIDE",
	"tour_id": "id of the reviewed tour",
	"tour_date": "date of the reviewed tour in ISO 8601 format",
	"guide": {
		"id": "141242asfdf",
		"name": "Mahmut"
	},
	"score": 8, // int
	"body" (OPTIONAL): "free form text of the review"
}
```


# Tour to Review Model
```
{
	"tour_id": "id of the tour to be reviewed",
	"tour_date": "date of the tour to be reviewed in ISO 8601 format",
	"guides": {
		"id": "141242asfdf",
		"name": "Mahmut"
	}[],
}
```

# Review Create Model
`tour_id` and `tour_date` fields are ALWAYS included.
`guide_id` and `guide_name` are included only if for=GUIDE
```
{
	"for": "TOUR" | "GUIDE",
	"tour_id": "id of the reviewed tour",
	"tour_date": "date of the reviewed tour in ISO 8601 format",
	"guides": {
		"id": "141242asfdf",
		"name": "Mahmut"
	}[],
	"score": 8, // int
	"body" (OPTIONAL): "free form text of the review",
}
```

# Simple Toys Application Model (Trainee Application)
```
{
	"id": "123456789",
	"fullname": "Balik Baliksatan",
	"experience": "4 events",
}
```

# Guide Model
```
{
  "experience": "18 events",
  "id": "12345678",
  "created_at": "2024-11-15T14:22:14Z",
  "updated_at": "2024-11-18T14:22:14Z",
  "fullname": "Mr. Something",
  "phone": "5313319696",
  "highschool": HighSchoolModel,
  "schedule": ScheduleModel,
  "iban": "TR438525023948394",
  "bank": "QNB Finansbank",
  "major": "Computer Science",
  "reviews": {
	"average": 4.28,
	"count": 12
  },
  "role": "GUIDE" | "TRAINEE" | "ADVISOR",
  "responsible_days": DayOfTheWeek[]
  "profile_picture": "base 64 string of the profile picture",
  "previous_tour_count": 0,
  "profile_description": "I want to be a guide because I love helping people.",
  "advisor_offer": True | False
}
```

# Day of The Week
"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

# Schedule Model
```
{
	DayOfWeek: DailyPlan
	... Monday through Sunday
}
```

# Daily Plan Model
```
{
	_830_930: TimeSlotStatus,
    _930_1030: TimeSlotStatus,
    _1030_1130: TimeSlotStatus,
    _1130_1230: TimeSlotStatus,
    _1230_1330: TimeSlotStatus,
    _1330_1430: TimeSlotStatus,
    _1430_1530: TimeSlotStatus,
    _1530_1630: TimeSlotStatus,
    _1630_1730: TimeSlotStatus,
    _1730_1830: TimeSlotStatus,
}
```

# Time Slot Status Enum
```
"FREE" | "BUSY" | "tour id guide needs to go at that time"
```

!!!! CHANGED - added "role" field
# Simple Guide Model
```
{
	"id": 22231331, // bilkent id
	"name": "Balik Baliksatan",
	"major": "CS",
	"role": "ADVISOR" | "TRAINEE" | "GUIDE"
	"experience": "3 events"
}
```

# Fair Model
```
{
	"fair_id": "fairid",
	"applicant": {
		"name": "Yavuz",
		"surname": "XD",
		"email": "yavuz.xd@something.com",
		"phone": "5555555555",
		"school": "Ankara Fen Lisesi",
	}
	"start_time": "2024-11-15T14:22:14Z",
	"end_time": "2024-11-15T14:22:14Z",
	"fair_name": "KARIYERKE",
	"status": "RECEIVED" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "ONGOING" | "FINISHED"
}
```

# Fair Application Model
```
{
	"applicant": {
		"fullname": "Yavuz XD", // it was "namename" before, wtf
		"email": "yavuz.xd@something.com",
		"phone": "5555555555",
		"school": HighschoolModel,
		"notes": "Notes by the applicant",
	},
	"start_time": "2024-11-15T14:22:14Z",
	"end_time": "2024-11-15T14:22:14Z",
	"fair_name": "KARIYERKE"
}
```

# Coordinator Model
```
{
	"id": "coordinatorId",
	"fullname": "full name of the coordinator"
}
```

# Dashboard Category
```
  "OWN_EVENT" | "EVENT_INVITATION" | "PENDING_APPLICATIONS" | "GUIDE_ASSIGNED" | "GUIDELESS" | "PENDING_MODIFICATION" |
```

# Advisor Offer Model
`rejection_reason` field included only if `status=REJECTED`
```
{
	"recipient": {
		"id": "bilko id of the guide who received the offer",
		"name": "Orhun Ege Çelik"
	},
	"status": ACCEPTED | REJECTED | PENDING,
	"offer_date": "2024-11-15T14:22:14Z",
	"response_date": "2024-11-18T14:22:14Z",
	"rejection_reason": "Yappi yap yap"
}
```

// THIS IS NEW
# Simple User Model
```
{
	"name": "Orhun Ege Çelik",
	"id": 12345678,
	"role": "COORDINATOR" | "ADVISOR" | "GUIDE" | "TRAINEE | DIRECTOR"
}
```


# Money for Guide Model
```
{
	"guide": {
		"id": 22554342412 // Bilkent ID
		"name": "Sydney Bleeney",
		"iban": "TR43525345345",
		"bank": "QNB Finansbank"
	},
	"unpaid_hours": 3.28 // float, can be zero, can even be negative to indicate forward-paid fees. negative values will be handled properly in the front-end
	"debt": 24 // in TL, can be zero, can even be negative to indicate forward-paid fees. negative values will be handled properly in the front-end
	"money_paid": 1248.5 // float, in TL. Sum of any and all money paid to the guide at any point in time.
}
```

# Money for Event Model
// THIS HAS BEEN CHANGED BE CAREFUL
Coordinator will ask for this model providing a guide ID.
The `hours_worked` and such refer to the guide with ID provided as a parameter
```
{
	"event_id": 41234343241sfd,
	"event_date": date the tour happened,
	"hourly_rate": 2.5 // float, in TL. This returns the hourly rate AT the date tour happened.
	"event_highschool": "Ankara Fen",
	"hours_worked": 3.2 // float, can NOT be lower than zero. zero will be interpreted as "Guide didn't enter Tour Start and End times yet."
	"money_debted": 2.0 // float, in TL.
	"money_paid": 1.8 // float, in TL. You see, MoneyForGuide model keeps track of the total `money_paid` to that Guide. What you do is that you assume that money was used to pay every tour STARTING FROM THE OLDEST one.
}
```

# Hourly Rate Model
```
{
	"rate": 2.2 // float, in TL
	"applied_from": date in ISO 8601 format,
	"applied_until": date in ISO 8601 format | "TODAY"
}
```

!!!! NEW
# Invitation Model
If a tour or fair is cancelled / rejected, delete all Invitation models related to it immediately.
```
{
	"inviter": {
		"id": "id of the inviter",
		"name": "name of the inviter"
	},
	"invited": {
		"id": "id of the invited guide",
		"name": "name of the invited guide"
	}

!!!! CHANGED
	"event": SimpleEventModel,
	"status": "WAITING_RESPONSE" | "ACCEPTED" | "REJECTED"
}
```


### Just Front-end

#### User
```
{
"role": "COORDINATOR" | "ADVISOR" | "GUIDE" | "TRAINEE | DIRECTOR",
"profile": {
	...the model
}
}
```



# API Endpoints
ALL endpoints specified as "Requires Auth" require authentication which will be provided as `Bearer {jwt_token}` in the Authorization header.
"Requries Auth" means Guide level authorization is sufficient. "Requires Auth as Coordinator" and "Requires Auth as Director" are further options.

"Requires Auth" tag besides a URL applies to all the endpoints prefixed with that URL.
Tag can be provided for individual endpoints as well.

```
API endpoints:
/auth
    /login #
        method: post
        body: loginInfoModel
        response: jwt_string
        response_type: string

    /isvalid #
        parameters:
            auth=token // token to check for validity
        method: get
        response: true/false
        response_type: string

!!! NEW ADMIN ENDPOINT !!! 
/admin
	/all-users
		parameters:
			auth: auth_token
		method: get
		response: SimpleUserModel[]

	/change-role
		parameters:
			auth: auth_token
			id: 12345678
			new_role: "COORDINATOR" | "ADVISOR" | "GUIDE" | "TRAINEE | DIRECTOR"

	/add-user
		parameters:
			auth: auth_token
			name: "Orhun Ege Çelik"
			role: "COORDINATOR" | "ADVISOR" | "GUIDE" | "TRAINEE | DIRECTOR"

	/remove-user
		parameters:
			auth: auth_token
			id: 12345678

/apply
    /guide #
        method: post
        body: guideApplicationModel
        response: -

    /tour #
        method: post
        body: groupTourApplicationModel | individualTourApplicationModel
        response: -

        /isfree 
            parameters:
                start=start_time
                end=end_time
            method: get

        /gettype #
            parameters:
                uuid=uuid of the application
            method: get
            response: type of application

        /request_changes 
            method: post
            parameters:
                tour_id: tourID
                auth: passkey | auth token 
            body: groupTourApplicationModel | individualTourApplicationModel
            response: -

        ### DEPRECATED ###
        # Use respond/tour/modification for modificaiton change responses
        /respond_changes

    /fair #
        method: post
        body: fairApplicationModel
        response: -

    /cancel #
        method: post
        parameters:
            auth: token //if applicant is cancelling, they provide passkey
            event_id: string
        body:
            {
                reason: string
            }

/review
!!!! NEW
parameters:
    review_id=id of the review
method: get
response: ReviewModel
response_type:json

    /tour
        parameters:
            reviewer_id=12354asd654 // Unique ID attached to the link in the participant's email that can be used to submit a review ONCE
        method: post
        body:
            ReviewCreateModel[] // one for the tour, one for the guide, and another one for the other guide if applicable
    
    /tour_details
        parameters:
            reviewer_id=12354asd654 // Unique ID attached to the link in the participant's email
        method: get
        response: TourToReviewModel
        response_type: json
    
    /delete (Requires Auth as Coordinator)
        parameters:
            review_id=12354asd654
            auth= auth_token
        method: post
        response: 200 or 400
        response_type: status code


    /of_tour (Requires Auth)
        parameters:
            tour_id=2590545wdge
            auth = auth_token
        method: get
        response: ReviewModel[]
        description: Send multiple review models, one for the tour and the others
        for the reviews of the guides on the same tour.

    /of_guide (Requires Auth)
        parameters:
            guide_id=2590545wdge
        method: get
        response: {
            "average": 5.67,
            "count": 25
            "reviews": ReviewModel[]
        }
        description: Only return reviews with status ACCEPTED and non-empty bodies.
        If there are no such reviews, still return "average" and "count". Take into account REJECTED reviews in calculating "average" and "count".

/respond
    /application
        /guide #
        method: post
        parameters:
            auth: auth_token
            applicant_id: "bilkent id of the applicant"
            response: true/false (accept / reject relatively)

        /tour #
        method: post
        parameters:
            auth: auth_token
            application_id: "id of the application"
            timeslot: "" (ISO8601 accepted time if tour is accepted, empty string otherwise)


            /modification
                method: post
                parameters:
                    auth: auth_token // passkey if an applicant is using this
                    tour_id: id of the tour
                    accepted_time: "" (ISO8601 accepted time, empty string means rejection)
                response: 200 or 400
                response_type: status code
                description: Both an Applicant or an Advisor can use this endpoint. An Applicant can use this endpoint to respond to "TOYS_WANTS_CHANGE"--where Advisor has offered 3 times and the Applicant picks one and the Tour becomes accepted. Vice versa for the Advisor.

        /fair #
        method: post
        parameters:
            auth: auth_token
            application_id: "id of the applicaiton"
            response: true/false (accept / reject)

    /guide
        /fair-invite
        method: post
        parameters:
            auth: auth_token
            request_id: "id of the assignment request"
            response: true/false (accept/reject)

        /tour-invite
        method: post
        parameters:
            auth: auth_token
            request_id: "id of the assignment request OR the tour for the guide"
            response: true/false (accept/reject)

        /promotion
        method: post
        parameters:
            auth: auth_token
            request_id: "id of the promotion request"
            response: true/false (accept/reject)


/internal (Requires Auth)
    @Deprecated! Frontend and Backend share a set of constant enums, please use them    
    /majors
        method: get
        response: string array of the Major enums
        response_type:json
        
     /event
        @ DEPRECATED, USE /event/tour/simple instead!
        /simple-tour

	/soon // gets events that have started or will start in ~ 1 hour
            parameters:
                auth: auth_token
            method: get
            response: SimpleEvent[]


        /enroll # NEEDS TEST
            parameters:
                event_id=event_id // which event to enroll for (Can only enroll in tours, don't make a mistake)
                auth: auth_token
            method: post
            response: -

        /withdraw
            parameters:
                event_id=event_id // which event to withdraw from (can be both fair and tour)
                auth: auth_token
            method: post
            response: - 

        /invite 
            parameters:
                event_id=event_id // which event to invite to (Advisors can only invite to tours, Coordinators & above can invite to fairs as well)
                guides: guide_id[] // MULTIPLE GUIDES CAN BE INVITED AT ONCE
                auth: auth_token
            method: post
            response: -

        /remove 
            parameters:
                event_id=event_id // which event to remove from
                guides: guide_id[] // MULTIPLE GUIDES CAN BE REMOVED AT ONCE
                auth: auth_token
            method: post
            response: -

        /fair
            parametes:
                auth=jwt token
                fair_id=fair_id
            method: get
            response: FairModel

            /search
                method: get
                parameters:
                    auth: authentication token
                    status (OPTIONAL): "RECEIVED" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "ONGOING" | "FINISHED"
                    guide_not_assigned (OPTIONAL): bool
                    enrolled_in_fair (OPTIONAL):
                    school_name: string
                    to_date: iso date string
                    from_date: iso date string
                    filter_guide_missing: bool
                    filter_trainee_missing: bool 
                response: list of fairs
                response_type: json

                ### DEPRECATED ###
                use /respond/applications/fair instead!
                /respond

        /tour
            parameters:
                auth= jwt token
                tour_id=tour_id
            method: get
            response: TourModel

            /simple
            parameters:
                auth=jwt token // passkey if Applicant is making this request
                tour_id=tour_id
            method: get
            response: SimpleEventModel

            /search
            parameters:
                auth= jwt token
                school_name = "BİLKENT ER" // OPTIONAL filter by highschool string
                status=string[] // OPTIONAL tour status filtering string ("RECEIVED", "TOYS_WANTS_CHANGE", "APPLICANT_WANTS_CHANGE", "CONFIRMED", "REJECTED", "CANCELLED", "ONGOING", "FINISHED")
                from_date=ISO 8601 string // OPTIONAL
                to_date=ISO 8601 string // OPTIONAL
                filter_guide_missing="true"/"false" // if False, include both guide missing and not missing.
                filter_trainee_missing="true"/"false" // if False, include both guide missing and not missing
                am_enrolled="true"/"false" // if False, include both enrolled and not enrolled
                am_invited="true"/"false" // if False, include both invited and not invited
                // from_date & to_date can be sent isolated or both. to_date will not be earlier than from_date 

            method: get
            response: List of tours (List<SimpleEventModel>)
                // REQUEST: Returned tours should be ordered with "ONGOING" first, then "APPLICANT_WANTS_CHANGE", then "RECEIVED",
                // then "CONFIRMED", then "TOYS_WANTS_CHANGE", then the rest

            /start-tour
                method: post
                parameters:
                    auth: jwt token
                    tour_id: id of the tour to start
                    start_time: iso8601 time of tour start // only advisor and above can set this, if guide provides it, it is simply ignored, but it must be given, even if its only an empty string, in which case it just does current time

            /end-tour
                method: post
                parameters:
                    auth: jwt token
                    tour_id: id of the tour to stop
                    end_time: iso8601 time of tour end // only advisor and above can set this, if guide provides it, it is simply ignored, but it must be given, even if its only an empty string, in which case it just does current time
            


    /user
        /guides
            parameters:
                auth: auth token
                name (OPTIONAL) = "Orhun Eg" // optional name search string
                type (OPTIONAL)  = "TRAINEE" | "GUIDE" | "ADVISOR" // optional parameter to filter by type 
            method: get
            response: SimpleGuideModel[]
            response_type: json
            
        /available-guides
            parameters:
                auth : authentication token // Requires auth as 
                time=time in ISO 8601 format
                type="TRAINEE" | "GUIDE" // GUIDE option includes Advisors as well
            method: post
            response: SimpleGuideModel[]
            response_type: json

        ### DEPRECATED
	# User /respond endpoints instead
        /advisor-offer (Requires Auth as Coordinator)
            /accept (Requires Auth as Guide who has pending Advisor Offer)
            /reject (Requires Auth as Guide who has pending Advisor Offer)

        /am-enrolled
            params:
                auth: auth token
                event_id: fair or tour id
            method: get
            response: true/false
            response_type: boolean
            description: returns whether the requesting Guide is enrolled in the event

        /am-invited
            params:
                auth: auth token
                event_id: fair or tour id
            method: get
            response: true / false
            response_type: boolean
            description: returns whether the requesting Guide is invited to the event

!!!! CHANGED
        /invitations (Requires auth as Advisor or up)
            params:
                auth: auth token
                my_invitations: "true" / "false" (OPTIONAL)
                invited_name="ORHUN EG" // OPTIONAL SEARCH STRING
                page=1
                per_page=5
            method: get
            response: InvitationModel[]
            response_type: json
            description: my_invitations = true returns the invitations sent by the requester


        /profile #
            parameters:
		auth: auth token
                id=id // user bilkent id / empty to get logged in user
            method: get
            response: GuideModel | CoordinatorModel
            response_type: json

            /update #
                parameters:
		    auth: auth token
                    id= id // user bilkent id
                method: post
                body: GuideModel
                response: -

            /simple
                parameters:
                    id=id // user bilkent id / empty to get logged in user
                    auth= jwt token
                method: get
                response: simpleGuideModel
                response_type: json
        
        ### DEPRECATED ###
        /requests 

            # DEPRECATED
            /respond

        # DOC MISSING
        /is-invited

        /dashboard
            parameters:
                auth: auth_token
                dashboard_category: DashboardCategory
            method: get
            response: SimpleEventModel[]
            


    /management
        /timesheet (Requires Auth as Coordinator)
            /hourly_rate
                method: post
                body: HourlyRateModel
                response: 200 or 400
                response_type: status code
                description: If the time interval of the provided HourlyRateModel overlaps with a previously existing HourlyRateModel,
                you do the following:
                    - If the time interval of the NEW HourlyRateModel is a subset of a previous HourlyRateModel, you delete the previous HourlyRateModel, add the new HourlyRateModel, and adjust the time interval of the remaining chronologically following AND / OR preceding HourlyRateModels so that there is no date remaining for which there is no corresponding hourly rate
                    - If the time interval of the NEW HourlyRateModel is both overlapping with the time interval of a previous HourlyRateModel and NOT a subset of the previous HourlyRateModel's time interval, REJECT the request and send status code 400 
            
                method: get // different method request to the same endpoint
                response: HourlyRateModel[]
                response_type: json

            /payment_state
                /guides
                    parameters:
                        auth: authToken
                        name (OPTIONAL)="Orhun Eg" // optional filter by name string
                    method: get
                    response: MoneyForGuideModel[]
                    response_type: json

                /guide
                    parameters:
                        auth: authToken
                        guide_id="bilko Id of the guide. Advisor is also guide"
                    method: get
                    response: MoneyForGuideModel
                    response_type: json

                /event
                    parameters:
                        auth: authToken
                        guide_id="bilko Id of the guide. Advisor is also guide"
                    method: get
                    response: MoneyForEventModel[]
                    response_type: json

            /pay
                /guide
                    parameters:
                        auth: authToken
                        guide_id="bilko Id of the guide. Advisor is also guide"
                    method: post
                    response: 200
                    response_type: status code
            ## DEPRECATED
            /unpay 

        /people
            # I Don't Know Who Wrote this but if this doc isn't fixed, I'm nuking the server
            method: get
            body: auth_token
            response: Simple
            response_type: json

            ## Refactored, (invite-advisor) -> (promote)
            /promote
                parameters:
                    auth: auth_token
                    user_id=id // who to promote
                method: post

            /applications
		method: get
		parameters:
			auth: auth_token
		response: Guide Applications[]

            /fire
                parameters:
                    id=fireeid // id of the person to fire
                    auth: authentication token
                method: post
                body: -

                ### DEPRECATED ###
                # Use /respond/applications instead!
                /respond

            ### DEPRECATED ###
            /invite

            ### DEPRECATED ###
            use /respond/applications/guide instead!
            /respond




```
