import { Route, Routes, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";

function App() {
  const location = useLocation();
  return (
    <>
    
      {location.pathname !== '/some_page_with_no_navbar' && <Navbar />}
      <Routes>

        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App