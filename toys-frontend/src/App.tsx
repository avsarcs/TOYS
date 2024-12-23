import {Route, Routes, useLocation} from "react-router-dom"

import {Navbar} from "./components/Navbar/Navbar.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import Force404 from "./pages/404/Force404.tsx";
import LoginPage from "./pages/Login/LoginPage.tsx";
import Comparison from "./pages/DataAnalysis/Comparison.tsx";
import UniversitiesList from "./pages/DataAnalysis/UniversitiesList.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import {hasNavbar} from "./lib/utils.tsx";
import HighSchoolsList from "./pages/DataAnalysis/HighSchoolsList.tsx";
import GroupTourApplication from "./pages/GroupTourApplication/GroupTourApplication.tsx";
import ApplicationSuccess from "./pages/ApplicationSuccess/ApplicationSuccess.tsx";
import IndividualTourApplication from "./pages/IndividualTourApplication/IndividualTourApplication.tsx";
import ToysApplications from "./pages/ToysApplications/ToysApplications.tsx";
import TraineeApplicationDetails from "./pages/TraineeApplicationDetails/TraineeApplicationDetails.tsx";
import AdvisorOffers from "./pages/CoordinatorPages/AdvisorOffers.tsx";
import GuidePayments from "./pages/Puantaj/GuidePayments.tsx";
import PaymentDetail from "./pages/Puantaj/PaymentDetail.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import EditProfilePage from "./pages/Profile/EditProfilePage.tsx";
import TourPage from "./pages/TourInformation/TourPage.tsx";
import TourReviewPage from "./pages/TourReview/TourReview.tsx";
import ReviewDetailsPage from "./pages/ReviewDetails/ReviewDetails.tsx";
import FairApplication from "./pages/FairApplication/FairApplication.tsx";
import ChangeHourlyRate from "./pages/Puantaj/ChangeHourlyRate.tsx";
import Contact from "./pages/Contact/Contact.tsx";
import ApplicantRespond from "./pages/ApplicantRespond/ApplicantRespond.tsx";
import ApplicantRequest from "./pages/ApplicantRequest/ApplicantRequest.tsx";
import "dayjs/locale/tr"
import dayjs from "dayjs";
import BilkentStudentDetails from "./pages/DataAnalysis/BilkentStudentDetails.tsx";
import RivalsList from "./pages/DataAnalysis/RivalsList.tsx";
import TourStatistics from "./pages/TourStatistics/TourStatistics.tsx";
import TourListPage from "./pages/TourList/TourListPage.tsx";
import CheckLogin from "./components/CheckLogin.tsx";
import ManagePersonnel from "./pages/ManagePersonnel/ManagePersonnel.tsx";
import FairsList from "./pages/FairsList/FairsList.tsx";
import FairPage from "./pages/FairInformation/FairPage.tsx";
import Admin from "./pages/Admin/Admin.tsx";
import UserManual from "./pages/UserManual/UserManual.tsx";
import GuideInvitations from "./pages/GuideInvitations/GuideInvitations.tsx";

function App() {
  dayjs.locale("tr");
  const location = useLocation().pathname;

  return (
    <>
      <div className="app-container">
        {hasNavbar(location) && <CheckLogin redirect children={<Navbar />}/>}
        <main className="flex-1 max-h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/*" element={<Force404 />} />
            <Route path="/comparison" element={<CheckLogin redirect required children={<Comparison />}/>} />
            <Route path="/dashboard" element={<CheckLogin redirect required children={<Dashboard />}/>} />
            <Route path="/tour/:tourId" element={<CheckLogin children={<TourPage />}/>} />
            <Route path="/tours" element={<CheckLogin redirect required children={<TourListPage />}/>}/>
            <Route path="/fair/:fairId" element={<CheckLogin children={<FairPage />}/>} />
            <Route path="/fairs" element={<CheckLogin redirect required children={<FairsList />}/>}/>
            <Route path="/universitieslist" element={<CheckLogin redirect children={<UniversitiesList />}/>}/>
            <Route path="/rivalslist" element={<CheckLogin redirect children={<RivalsList />}/>} />
            <Route path="/highschoolslist" element={<CheckLogin redirect children={<HighSchoolsList />}/>} />
            <Route path="/bilkentstudentdetails" element={<CheckLogin redirect children={<BilkentStudentDetails />}/>} />
            <Route path="/group-tour-application" element={<GroupTourApplication />} />
            <Route path="/individual-tour-application" element={<IndividualTourApplication />} />
            <Route path="/fair-application" element={<FairApplication />} />
            <Route path="/application-success" element={<ApplicationSuccess />}/>
            <Route path="/toys-applications" element={<CheckLogin required redirect children={<ToysApplications />}/>} />
            <Route path="/trainee-application-details/:application_id" element={<CheckLogin required redirect children={<TraineeApplicationDetails />}/>}/>
            <Route path="/advisor-offers" element={<CheckLogin required redirect children={<AdvisorOffers />}/>} />
            <Route path="/guide-payments" element={<CheckLogin required redirect children={<GuidePayments />}/>} />
            <Route path="/payment-detail/:guideId" element={<CheckLogin required redirect children={<PaymentDetail />}/>} />
            <Route path="/profile/:profileId" element={<CheckLogin required redirect children={<ProfilePage />}/>}/>
            <Route path="/profile" element={<CheckLogin required redirect children={<ProfilePage />}/>}/>
            <Route path="/edit-profile" element={<CheckLogin required redirect children={<EditProfilePage />}/>}/>
            <Route path="/review-tour/:reviewer-id" element={<TourReviewPage />}/>
            <Route path="/review/:review-id" element={<CheckLogin required redirect children={<ReviewDetailsPage />}/>}/>
            <Route path="/tourstatistics" element={<CheckLogin required redirect children={<TourStatistics />}/>}/>
            <Route path="/manage-personnel" element={<CheckLogin required redirect children={<ManagePersonnel />}/>}/>
            <Route path="/applicant-respond/:passkey/:tour_id" element={<ApplicantRespond />} />
            <Route path="/applicant-request/:passkey" element={<ApplicantRequest />}/>
            <Route path="/change-hourly-rate" element={<CheckLogin required redirect children={<ChangeHourlyRate />}/>}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/admin" element={<CheckLogin required redirect children={<Admin />}/>}/>
            <Route path="/user-manual" element={<CheckLogin required redirect children={<UserManual />}/>}/>
            <Route path="/guide-invitations" element={<CheckLogin required redirect children={<GuideInvitations />}/>}/>
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;