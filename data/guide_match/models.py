# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = guide_from_dict(json.loads(json_string))

from typing import Any, List, TypeVar, Callable, Type, cast


T = TypeVar("T")


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def from_bool(x: Any) -> bool:
    assert isinstance(x, bool)
    return x


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


class Highschool:
    name: str
    id: int
    location: str
    priority: int

    def __init__(self, name: str, id: int, location: str, priority: int) -> None:
        self.name = name
        self.id = id
        self.location = location
        self.priority= priority

    @staticmethod
    def from_dict(obj: Any) -> 'Highschool':
        assert isinstance(obj, dict)
        name = from_str(obj.get("name"))
        id = from_int(obj.get("id"))
        location = from_str(obj.get("location"))
        priority = from_int(obj.get("priority"))
        return Highschool(name, id, location, priority)

    def to_dict(self) -> dict:
        result: dict = {}
        result["name"] = from_str(self.name)
        result["id"] = from_int(self.id)
        result["location"] = from_str(self.location)
        result["priority"] = from_int(self.priority)
        return result


class Guide:
    experience: str
    id: int
    fullname: str
    phone: str
    highschool: Highschool
    iban: str
    major: str
    role: str
    profile_picture: str
    previous_tour_count: int
    profile_description: str
    advisor_application_status: bool
    attended_tours: List[Any]

    def __init__(self, experience: str, id: int, fullname: str, phone: str, highschool: Highschool, iban: str, major: str, role: str, profile_picture: str, previous_tour_count: int, profile_description: str, advisor_application_status: bool, attended_tours: List[Any]) -> None:
        self.experience = experience
        self.id = id
        self.fullname = fullname
        self.phone = phone
        self.highschool = highschool
        self.iban = iban
        self.major = major
        self.role = role
        self.profile_picture = profile_picture
        self.previous_tour_count = previous_tour_count
        self.profile_description = profile_description
        self.advisor_application_status = advisor_application_status
        self.attended_tours = attended_tours

    @staticmethod
    def from_dict(obj: Any) -> 'Guide':
        assert isinstance(obj, dict)
        experience = from_str(obj.get("experience"))
        id = from_int(obj.get("id"))
        fullname = from_str(obj.get("fullname"))
        phone = from_str(obj.get("phone"))
        highschool = Highschool.from_dict(obj.get("highschool"))
        iban = from_str(obj.get("iban"))
        major = from_str(obj.get("major"))
        role = from_str(obj.get("role"))
        profile_picture = from_str(obj.get("profile_picture"))
        previous_tour_count = from_int(obj.get("previous_tour_count"))
        profile_description = from_str(obj.get("profile_description"))
        advisor_application_status = from_bool(obj.get("advisor_application_status"))
        attended_tours = from_list(lambda x: x, obj.get("attended_tours"))
        return Guide(experience, id, fullname, phone, highschool, iban, major, role, profile_picture, previous_tour_count, profile_description, advisor_application_status, attended_tours)

    def to_dict(self) -> dict:
        result: dict = {}
        result["experience"] = from_str(self.experience)
        result["id"] = from_int(self.id)
        result["fullname"] = from_str(self.fullname)
        result["phone"] = from_str(self.phone)
        result["highschool"] = to_class(Highschool, self.highschool)
        result["iban"] = from_str(self.iban)
        result["major"] = from_str(self.major)
        result["role"] = from_str(self.role)
        result["profile_picture"] = from_str(self.profile_picture)
        result["previous_tour_count"] = from_int(self.previous_tour_count)
        result["profile_description"] = from_str(self.profile_description)
        result["advisor_application_status"] = from_bool(self.advisor_application_status)
        result["attended_tours"] = from_list(lambda x: x, self.attended_tours)
        return result


def guide_from_dict(s: Any) -> Guide:
    return Guide.from_dict(s)


def guide_to_dict(x: Guide) -> Any:
    return to_class(Guide, x)