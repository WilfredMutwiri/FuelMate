import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Signup from "./components/signup"
import SignIn from "./components/Signin"
import AdminDashboard from "./components/AdminDashboard"
import NavBar from "./components/NavBar"
import Footer from "./components/FooterComp"
import Landing from "./components/Landing"

import EmergencyRequests from "./components/Manage_Database/EmergencyRequests"
import ApprovedStations from "./components/Manage_Database/ApprovedStations"
import RegisteredStations from "./components/Manage_Database/RegisteredStations"
import PendingApprovals from "./components/Manage_Database/PendingApprovals"
import Statistics from "./components/Manage_Database/Statistics"

import TeachersSquare from "./components/Messages/TeachersSquare"
import About from "./components/About"
import WorkerDetails from "./components/DynamicData/WorkerDetails"
import StationDetails from "./components/DynamicData/StationDetails"
function App() {
  return (
    <>
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/Landing" element={<Landing/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/SignIn" element={<SignIn/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>

        <Route path="/EmergencyRequests" element={<EmergencyRequests/>}/>
        <Route path="/ApprovedStations" element={<ApprovedStations/>}/>
        <Route path="/RegisteredStations" element={<RegisteredStations/>}/>
        <Route path="/PendingApprovals" element={<PendingApprovals/>}/>
        <Route path="/statistics" element={<Statistics/>}/>

        <Route path="/teachersSquare" element={<TeachersSquare/>}/>
        <Route path="/about" element={<About/>}/>

        {/* dynamic routes */}
        <Route path="/worker/:id" element={<WorkerDetails/>}/>
        <Route path="/station/:id" element={<StationDetails/>}/>
      </Routes>
      <Footer/>
    </Router>
    </>
  )
}

export default App
