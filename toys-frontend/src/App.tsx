import { Route, Routes, useLocation } from "react-router-dom"

import { Navbar } from "./components/Navbar/Navbar.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import Force404 from "./pages/404/Force404.tsx";
import LoginPage from "./pages/Login/LoginPage.tsx";
import Comparison from "./pages/DataAnalysis/Comparison.tsx";
import UniversitiesList from "./pages/DataAnalysis/UniversitiesList.tsx";
import { hasNavbar } from "./lib/utils.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";

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
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/universitieslist" element={<UniversitiesList />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;