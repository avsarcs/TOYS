import { Route, Routes, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/Home/HomePage.tsx";
import Force404 from "./pages/404/Force404.tsx";
import { hasNavbar } from "./lib/utils.tsx";

function App() {
  const location = useLocation().pathname;

  return (
    <>
      {hasNavbar(location) && <Navbar/>}
      <main>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/*" element={<Force404/>}/>
        </Routes>
      </main>
    </>
  )
}

export default App;