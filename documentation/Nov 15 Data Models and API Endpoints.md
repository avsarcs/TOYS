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
	"status": "AWAITING_CONFIRMATION" | "APPLICANT_WANTS_CHANGE" | "TOYS_WANTS_CHANGE" | "APPROVED" | "REJECTED"
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
	"status": "AWAITING_CONFIRMATION" | "APPLICANT_WANTS_CHANGE" | "TOYS_WANTS_CHANGE" | "APPROVED" | "REJECTED"
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
	"event_id": "id",
	"event_status": "AWAITING_CONFIRMATION" | "APPLICANT_WANTS_CHANGE" | "TOYS_WANTS_CHANGE" | "APPROVED" | "REJECTED"
	"highschool": HighSchoolModel
	// accepted_time field empty/null for tours AWAITING_MODIFICATION
	"accepted_time": "2024-11-15T14:22:14Z",
	"requested_time": ["2024-11-16T14:22:14Z", "2024-11-17T14:22:14Z"],
	"visitor_count": 34,
	"guide": [ {"id": "guide id", "full_name":"guide_name" ] ... ],
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
	"priority": 1 (min. 1, max. 4)
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

# Simple Guide Model
```
{
	"id": 22231331, // bilkent id
	"name": "Balik Baliksatan",
	"major": "CS",
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
	"status": "AWAITING_CONFIRMATION" | "APPLICANT_WANTS_CHANGE" | "APPROVED" | "REJECTED"
}
```

# Fair Application Model
```
{
	"applicant": {
		"name": "Yavuz",
		"surname": "XD",
		"email": "yavuz.xd@something.com",
		"phone": "5555555555",
		"school": "Ankara Fen Lisesi",
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

# Money for Tour Model
Coordinator will ask for this model providing a guide ID.
The `hours_worked` and such refer to the guide with ID provided as a parameter
```
{
	"tour_id": 41234343241sfd,
	"tour_date": date the tour happened,
	"hourly_rate": 2.5 // float, in TL. This returns the hourly rate AT the date tour happened.
	"tour_highschool": "Ankara Fen",
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

		/gettype
		parameters:
			uuid=uuid of the application
		method: get
		response: type of application

		/request_changes #NEEDS TEST
			method: post
			parameters:
				tour-id: tourID
				passkey: passkey
			body: groupTourApplicationModel | individualTourApplicationModel
			response: -

		/respond_changes # The 
			method: post
			parameters:
				tour-id: tourID
				passkey: passkey
				response=accept/deny // accept or reject changes
				accepted_time="2024-12-17T14:45:17+03:00" // ISO 8601, time that the Tour starts
				// You MUST check that accepted_time is within the offered times of the Advisor.
				// accepted_time is only for when response=accept
                // bool value, True=accept
			response: 200 or 400
			response_type: status code

	/fair #
		method: post
		body: fairApplicationModel
		response: -

/review
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
		response: ReviewModel
		description: Only return reviews with status ACCEPTED and non-empty bodies.
		If there are no such reviews, still return "average" and "count". Take into account REJECTED reviews in calculating "average" and "count".

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
	/tours #
	    parameters:
	        tid=tour_id // which tour is this for
	        response=accept/deny // what is the response
			accepted_time="2024-12-17T14:45:17+03:00" // ISO 8601, time that the Tour starts
			auth=auth_token
			// accepted_time is only for when response=accept
	        // bool value, True=accept
	    method: post
		response: 200 or 400
		response_type: status code

		/request_changes # Advisor will request changes for the tour from this endpoint
			parameters:
				tid=tour_id // which tour is this for
				auth=auth_token
			method: post
			body: {
				"requested_times": []
			}
			response: 200 or 400
			response_type: status code

	    /changes # Advisor responds to the Applicant's change request from this endpoint
            parameters:
                idt=identifier_token // to keep track of the request
                response=accept/deny // accept or reject changes
				accepted_time="2024-12-17T14:45:17+03:00" // ISO 8601, time that the Tour starts
				// You MUST check that accepted_time is within the offered times of the Applicant.
				// accepted_time is only for when response=accept
                // bool value, True=accept
            method: post
            body: -
            response: -

/internal (Requires Auth)
	/majors
		method: get
		response: string array of the Major enums
		response_type:json
		
	/user
		/guides
			parameters:
				name (OPTIONAL) = "Orhun Eg" // optional name search string
				type (OPTIONAL)  = "TRAINEE" | "GUIDE" | "ADVISOR" // optional parameter to filter by type 
			method: get
			response: SimpleGuideModel[]
			response_type: json
			
		/available_guides
			parameters:
				time=time in ISO 8601 format
				type="TRAINEE" | "GUIDE" // GUIDE option includes Advisors as well
			method: post
			response: SimpleGuideModel[]
			response_type: json

		/advisor_offer (Requires Auth as Coordinator)
			parameters:
				name (OPTIONAL) = "Orhun Eg" // optional filter by name search string
				type (OPTIONAL) = "ACCEPTED" | "REJECTED" | "PENDING" [] // optional filtering by type, multiple selections are possible
				from_date (OPTIONAL) = time in ISO 8601 format
				to_date (OPTIONAL) = time in ISO 8601 format
				// from_date & to_date should be provided together, never only one
			method: get
			response: AdvisorOfferModel[]
			response_type: json


			/accept (Requires Auth as Guide who has pending Advisor Offer)
				method: post
				body: empty
				response: 403 if has no Auth as Guide who has pending Advisor Offer, 200 otherwise
				response_type: status code
			
			/reject (Requires Auth as Guide who has pending Advisor Offer)
				method: post
				body: {
					"reason": "Yappi yap yap"
				}
				response: 403 if has no Auth as Guide who has pending Advisor Offer
				response_type: status code
			
		/profile #
			parameters:
				id=id // user bilkent id / empty to get logged in user
			method: get
			response: GuideModel | CoordinatorModel
			response_type: json

			/update #
			    parameters:
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
		
		/requests # NEEDS TEST
			method: get
			parameters:
                authToken= jwt token
			response: List of Requests (List<RequestBase>)
			response_type: json

			/respond # NEEDS TEST
				parameters:
					rid=request_id // which request is being responded to
					response=accept/deny // what is the response
					// bool value, True=accept
				method: get
				response: -
		/dashboard
			parameters:
				authToken: auth_token
				dashboard_category: NotificationCategory
			method: get
			response: SimpleEventModel[]
			
	/event
		/tour
			parameters:
				auth= jwt token
				tid=tour_id
			method: get
			response: TourModel
			response_type: json

	/tours # NEEDS TEST
		parameters:
			authToken= jwt token
		method: get
		response: List of tours (List<SimpleEventModel>)
		response_type: json

		/status_update # NEEDS TEST
			parameters:
				tid=tour_id // which tour is this for
				status=status // which status to update to (ACCEPTED, REJECTED, TOYS_WANTS_CHANGE, APPLICANT_WANTS_CHANGE, AWAITING_CONFIRMATION)
				authToken: auth_token
			method: post
			response: -

		# Just realized we are missing un-enroll
		/enroll # NEEDS TEST
			parameters:
				tid=tour_id // which tour to enroll for
				auth: auth_token
			method: post
			response: -

		/withdraw
			parameters:
				tid=tour_id // which tour to withdraw from
				auth: auth_token
			method: post
			response: -	

		/invite # NEEDS TEST
			parameters:
				tid=tour_id // which tour to invite to
				guid=guide_id[] // MULTIPLE GUIDES CAN BE INVITED AT ONCE
				auth: auth_token
			method: post
			response: -

 !!!! ADDED REMOVING GUIDES
		/remove # NEEDS TEST
			parameters:
				tid=tour_id // which tour to remove to
				guid=guide_id[] // MULTIPLE GUIDES CAN BE REMOVED AT ONCE
				auth: auth_token
			method: post
			response: -
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
						name (OPTIONAL)="Orhun Eg" // optional filter by name string
					method: get
					response: MoneyForGuideModel[]
					response_type: json

				/guide
					parameters:
						guide_id="bilko Id of the guide. Advisor is also guide"
					method: get
					response: MoneyForGuideModel
					response_type: json

				/tour
					parameters:
						guide_id="bilko Id of the guide. Advisor is also guide"
					method: get
					response: MoneyForTourModel[]
					response_type: json

			/pay
				/guide
					parameters:
						guide_id="bilko Id of the guide. Advisor is also guide"
					method: post
					response: 200
					response_type: status code
			
			/unpay // to fix mistakes
				/guide
					parameters:
						guide_id="bilko Id of the guide. Advisor is also guide"
					method: post
					response: 200
					response_type: status code

		/people
			method: get
			body: auth_token
			response: Simple
			response_type: json

			/invite-advisor
                parameters:
                    auth: auth_token
                    guide_id=id // who to invite
                method: post
                response: -

			/applications
				parameters:
					type: "ADVISOR" | "TRAINEE"
				method: get
				body: auth_token
				response: list of people applications
				response_type: SimpleGuideModel[]

				/respond
					parameters:
						id=id // id of the applicant
						response=response // accepted or rejected etc
					method: post
					body: auth_token
					response: -

			/invite
				parameters:
					fid=fair_id // which fair to invite to
					id=id // who to invite
				method: post
				body: auth_token
				response: -

			/fire
				parameters:
					id=fireeid // id of the person to fire
				method: post
				body: auth_token
				response: -

			/respond
				parameters:
					id=id of the person whose application we are responding to
					response=accept/deny // bool value, True=accept
				method: post
				body: auth_token
				response: -

		/fairs
			method: get
			parameters:
				status (OPTIONAL): "AWAITING_CONFIRMATION" | "COMPLETED" | "ACCEPTED" | "REJECTED" | "CANCELLED"
				guide_not_assigned (OPTIONAL): bool
				enrolled_in_fair (OPTIONAL): 
			body: auth_token
			response: list of fairs
			response_type: json

			/respond
				parameters:
					fid=fair_id // which fair application (all applications are fairs with status applied) to respond to
					response=response // what is the response (accept/deny)
					// bool value, True=accept
				method: post
				body: auth_token
				response: -

```
