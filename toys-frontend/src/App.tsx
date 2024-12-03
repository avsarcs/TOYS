import { Route, Routes, useLocation } from "react-router-dom"

import { Navbar } from "./components/Navbar/Navbar.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import Force404 from "./pages/404/Force404.tsx";
import LoginPage from "./pages/Login/LoginPage.tsx";
import Comparison from "./pages/DataAnalysis/Comparison.tsx";
import UniversitiesList from "./pages/DataAnalysis/UniversitiesList.tsx";
import { hasNavbar } from "./lib/utils.tsx";
import HighSchoolsList from "./pages/DataAnalysis/HighSchoolsList.tsx";
import GroupTourApplication from "./pages/GroupTourApplication/GroupTourApplication.tsx";
import ApplicationSuccess from "./pages/ApplicationSuccess/ApplicationSuccess.tsx";
import IndividualTourApplication from "./pages/IndividualTourApplication/IndividualTourApplication.tsx";
import ToysApplications from "./pages/ToysApplications/ToysApplications.tsx";
import TraineeApplicationDetails from "./pages/TraineeApplicationDetails/TraineeApplicationDetails.tsx";
import AdvisorApplicationDetails from "./pages/AdvisorApplicationDetails/AdvisorApplicationDetails.tsx";
import BilkentStudentDetails from "./pages/DataAnalysis/BilkentStudentDetails.tsx";

function App() {
  const location = useLocation().pathname;

  return (
    <>
      <div className="app-container">
        {hasNavbar(location) && <Navbar />}
        <main className="flex-1 max-h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/*" element={<Force404 />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/universitieslist" element={<UniversitiesList />} />
            <Route path="/highschoolslist" element={<HighSchoolsList />} />
            <Route path="bilkentstudentdetails" element={<BilkentStudentDetails />} />
            <Route path="/group-tour-application" element={<GroupTourApplication />} />
            <Route path="/individual-tour-application" element={<IndividualTourApplication />} />
            <Route path="/application-success" element={<ApplicationSuccess/>}/>
            <Route path="/toys-applications" element={<ToysApplications/>} />
            <Route path="/trainee-application-details/:application_id" element={<TraineeApplicationDetails/>} />
            <Route path="/advisor-application-details/:application_id" element={<AdvisorApplicationDetails/>} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;