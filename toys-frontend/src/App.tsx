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

import "dayjs/locale/tr"
import dayjs from "dayjs";
import BilkentStudentDetails from "./pages/DataAnalysis/BilkentStudentDetails.tsx";
import RivalsList from "./pages/DataAnalysis/RivalsList.tsx";
import TourStatistics from "./pages/TourStatistics/TourStatistics.tsx";
import TourListPage from "./pages/TourList/TourListPage.tsx";
import RequiresLogin from "./components/RequiresLogin.tsx";
import {useContext} from "react";
import {UserContext} from "./context/UserContext.tsx";
import {UserFetchingStatus} from "./types/enum.ts";

function App() {
  dayjs.locale("tr");
  const location = useLocation().pathname;
  const userContext = useContext(UserContext);

  return (
    <>
      <div className="app-container">
        {hasNavbar(location) && userContext.fetchStatus === UserFetchingStatus.DONE && <Navbar />}
        <main className="flex-1 max-h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/*" element={<Force404 />} />
            <Route path="/comparison" element={<RequiresLogin children={<Comparison />}/>} />
            <Route path="/dashboard" element={<RequiresLogin children={<Dashboard />}/>} />
            <Route path="/tour/:tourId" element={<RequiresLogin children={<TourPage />}/>} />
            <Route path="/tours" element={<RequiresLogin children={<TourListPage />}/>}/>
            <Route path="/universitieslist" element={<RequiresLogin children={<UniversitiesList />}/>}/>
            <Route path="/rivalslist" element={<RequiresLogin children={<RivalsList />}/>} />
            <Route path="/highschoolslist" element={<RequiresLogin children={<HighSchoolsList />}/>} />
            <Route path="/bilkentstudentdetails" element={<RequiresLogin children={<BilkentStudentDetails />}/>} />
            <Route path="/group-tour-application" element={<GroupTourApplication />} />
            <Route path="/individual-tour-application" element={<IndividualTourApplication />} />
            <Route path="/fair-application" element={<FairApplication />} />
            <Route path="/application-success" element={<ApplicationSuccess />}/>
            <Route path="/toys-applications" element={<RequiresLogin children={<ToysApplications />}/>} />
            <Route path="/trainee-application-details/:application_id" element={<RequiresLogin children={<TraineeApplicationDetails />}/>}/>
            <Route path="/advisor-offers" element={<RequiresLogin children={<AdvisorOffers />}/>} />
            <Route path="/guide-payments" element={<RequiresLogin children={<GuidePayments />}/>} />
            <Route path="/payment-detail/:guideId" element={<RequiresLogin children={<PaymentDetail />}/>} />
            <Route path="/profile/:profileId" element={<RequiresLogin children={<ProfilePage />}/>}/>
            <Route path="/profile" element={<RequiresLogin children={<ProfilePage />}/>}/>
            <Route path="/edit-profile" element={<RequiresLogin children={<EditProfilePage />}/>}/>
            <Route path="/review-tour/:reviewer-id" element={<TourReviewPage />}/>
            <Route path="/review/:review-id" element={<RequiresLogin children={<ReviewDetailsPage />}/>}/>
            <Route path="/tourstatistics" element={<RequiresLogin children={<TourStatistics />}/>}/>
            <Route path="/change-hourly-rate" element={<RequiresLogin children={<ChangeHourlyRate />}/>}/>
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;