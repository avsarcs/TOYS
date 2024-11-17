import { Route, Routes, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/Home/HomePage.tsx";
import Force404 from "./pages/404/Force404.tsx";
import LoginPage from "./pages/Login/LoginPage.tsx";
import Comparison from "./pages/DataAnalysis/Comparison.tsx";
import { hasNavbar } from "./lib/utils.tsx";
import GroupTourApplication from "./pages/GroupTourApplication/GroupTourApplication.tsx";
import ApplicationSuccess from "./pages/ApplicationSuccess/ApplicationSuccess.tsx";
import IndividualTourApplication from "./pages/IndividualTourApplication/IndividualTourApplication.tsx";

function App() {
  const location = useLocation().pathname;

  return (
    <>
      {hasNavbar(location) && <Navbar/>}
      <main>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path="/*" element={<Force404/>}/>
          <Route path="/comparison" element={<Comparison/>}/>
          <Route path="/group_tour_application" element={<GroupTourApplication/>}/>
          <Route path="/individual_tour_application" element={<IndividualTourApplication/>}/>
          <Route path="/application_success" element={<ApplicationSuccess/>}/>
        </Routes>
      </main>
    </>
  )
}

export default App;