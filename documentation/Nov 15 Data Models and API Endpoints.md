# Group Tour Model
```
{
	"highschool_name": "Ankara Fen Lisesi",
	"guides": [ //array of guide names	],
	"trainee_guides": [ // array of trainee guide names ],
	"type": "group", // frontend will do conditional rendering based on this property
	"requested_times": ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
	"accepted_time": "2024-09-30T09:00:00Z",
	"visitor_count": 66,
	"status": "AWAITING_CONFIRMATION" | "APPLICANT_WANTS_CHANGE" | "TOYS_WANTS_CHANGE" | "APPROVED" | "REJECTED"
	"notes": "The notes for the tour added by the tour guide and the advisor.",
	"applicant": {
		"fullname": "TheNameOfTheApplicant1",
		"role": "student", // or "teacher"
		"email": "TheEmailOfTheApplicant1",
		"phone": "ThePhoneOfTheApplicant1",
		"notes": "Notes added by the applicant."
	},
	"actual_start_time": "2024-11-15T14:22:14Z",
	"actual_end_time": "2024-11-15T14:22:14Z",
	"classroom": "Mithat Çoruh"
}
```


# Group Tour Application Model
```
{
	"highschool_name": "Ankara Fen Lisesi",
	"requested_times": ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
	"visitor_count": 66,
	"notes": "The notes for the tour added by the tour guide and the advisor.",
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
	"highschool_name": "Ankara Fen Lisesi",
	"requested_times": ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
	"requested_majors": [ "major1", "major2", "major3" ],
	"visitor_count": 4,
	"applicant": {
		"fullname": "TheNameOfTheApplicant1",
		"email": "TheEmailOfTheApplicant1",
		"phone": "ThePhoneOfTheApplicant1",
		"notes": "Notes added by the applicant."
	}
}
```

# Individual Tour Model

```
{
	"highschool_name": "Ankara Fen Lisesi",
	"guides": [ //array of guide names	],
	"trainee_guides": [ // array of trainee guide names ],
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
	"id": "tour_id"
	"high_school": "Ankara Fen Lisesi",
	// time field absent for tours AWAITING_MODIFICATION
	"time"?: "2024-11-15T14:22:14Z",
	"visitor_count": 34,
	"guide": "Guide Name"
}
```


# Guide Application Model
```
{
  "full_name": "John Doe",
  "id": "12345678",
  "high_school": "IBRAHIM KARATAS LISESI",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "major": "COMPUTER_SCIENCE",
  "current_semester": 5,
  "next_semester_exchange": true,
  "howdidyouhear": "Through university website",
  "whyapply": "To gain international experience"
}
```

# Guide Model
```
{
  "experience_level": "18", // unit: months
  "id": "12345678",
  "fullname": "Mr. Something",
  "phone": "555 555 55 55"
  "high_school": "High School Not Set",
  "major": "Computer Science",
  "role": "GUIDE" | "AMATEUR" | "ADVISOR"
  "profile_picture": "",
  "previous_tour_count": 0,
  "profile_description": "I want to be a guide because I love helping people.",
  "advisor_application_status": True | False
  "attendedTours": []
}
```

# Advisor Application Model
```
{
  "id": "12345678",
  "high_school": "High School Not Set",
  "phone": "555 555 55 55",
  "major": "Computer Science",
  "application_explanation" : "yapyapyap",
  "experience_level": "18 months"
}
```

# Simple Guide Model
```
{
	"id": 22231331, // bilkent id
	"name": "Balik Baliksatan",
	"major": "CS",
	"experience": "3 months"
}
```

# Fair Model
```
{
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
	"status": "AWAITING_CONFIRMATION" | "APPLICANT_WANTS_CHANGE" | "TOYS_WANTS_CHANGE" | "APPROVED" | "REJECTED"
}
```

# Coordinator Model
```
{
	"id": "coordinatorId",
	"fullname": "full name of the coordinator"
}
```

# Notification Category
```
"AWAITING_CONFIRMATION" | "GUIDE_ASSIGNED" | "NO_GUIDE_ASSIGNED" | "AWAITING_MODIFICATION" | "OWN_TOUR"
```

### Just Front-end

#### User
```
{
"role": "coordinator" | "advisor" | "guide" | "trainee",
"profile": {
	...the model
}
}
```



# API Endpoints
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

        /individual #
            method: post
            body: groupTourApplicationModel | individualTourApplicationModel
            response: -

		/request_changes #NEEDS TEST
			method: post
			body: tourChangeRequestModel
			response: -
	/fair #
		method: post
		body: fairApplicationModel
		response: -

/respond
	/tours #
	    parameters:
	        tid=tour_id // which tour is this for
	        response=accept/deny // what is the response
	        // bool value, True=accept
	    method: post
	    body: auth_token // auth token

	    /changes # NEEDS TEST
            parameters:
                idt=identifier_token // to keep track of the request
                response=accept/deny // accept or reject changes
                // bool value, True=accept
            method: post
            body: -
            response: -

/internal
	/user
		/simple
			parameters:
				type="TRAINEE" | "GUIDE" | "ADVISOR"
			method: get
			response: simpleGuideModel[]
			response_type: json
			
		/available_guides
			parameters:
				time=time in ISO 8601 format
				type="TRAINEE" | "GUIDE" // GUIDE option includes Advisors as well
			method: post
			response: simpleGuideModel[]
			response_type: json
			
		/profile #
			parameters:
				id=id // user bilkent id\ empty to get logged in user
			    authToken= jwt token
			method: get
			response: profileModel
			response_type: json

			/update #
			    parameters:
			        authToken= jwt token
				method: post
				body: profileModel
				response: -

		/requests # NEEDS TEST
			method: get
			parameters:
                authToken= jwt token
			response: List of Requests (List<RequestBase>)
			response_type: json

			/respond # NEEDS TEST
				parameters:
					rid=request_id // which request is beind responded to
					response=accept/deny // what is the response
					// bool value, True=accept
				method: get
				response: -

	/tours # NEEDS TEST
		parameters:
			authToken= jwt token
		method: get
		response: List of tours (List<TourModel>)
		response_type: json

		/status-update # NEEDS TEST
			parameters:
				tid=tour_id // which tour is this for
				status=status // which status to update to (ONGOING, FINISHED, CANCELLED)
				authToken: auth_token
			method: post
			response: -

		# Just realized we are missing un-enroll
		/enroll # NEEDS TEST
			parameters:
				tid=tour_id // which tour to enroll for
				authToken: auth_token
			method: post
			response: -

		/withdraw
			parameters:
				tid=tour_id // which tour to withdraw from
				authToken: auth_token
			method: post
			response: -	

		/invite # NEEDS TEST
			parameters:
				tid=tour_id // which tour to invite to
				guid=guide_id // who to invite
				authToken: auth_token
			method: post
			response: -

		/notifications
			parameters:
				authToken: auth_token
				notification_category: NotificationCategory
			method: get
			response: SimpleEventModel[]

	/management
		/people
			method: get
			body: auth_token
			response: a list of guides/advisors etc and work done by them etc etc
			response_type: json

			/applications
				parameters:
					type: "ADVISOR" | "AMATEUR_GUIDE"
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