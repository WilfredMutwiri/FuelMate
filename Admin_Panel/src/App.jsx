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
import OrderDetails from "./components/DynamicData/EmergencyOrderDetails"
import StationDetails from "./components/DynamicData/StationDetails"

import RejectedEmergencyRequests from './components/Manage_Database/rejectedEmergencyOrders'
import PendingEmergencyRequests from './components/Manage_Database/pendingRequests'
import AcceptedEmergencyRequests from './components/Manage_Database/acceptedEmergecyOrders'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Router>
      <NavBar/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/Landing" element={<Landing/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/SignIn" element={<SignIn/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>

        <Route path="/EmergencyRequests" element={<EmergencyRequests/>}/>
        <Route path="/RejectedEmergencyRequests" element={<RejectedEmergencyRequests/>}/>
        <Route path="/PendingEmergencyRequests" element={<PendingEmergencyRequests/>}/>
        <Route path="/AcceptedEmergencyRequests" element={<AcceptedEmergencyRequests/>}/>


        <Route path="/ApprovedStations" element={<ApprovedStations/>}/>
        <Route path="/RegisteredStations" element={<RegisteredStations/>}/>
        <Route path="/PendingApprovals" element={<PendingApprovals/>}/>
        <Route path="/statistics" element={<Statistics/>}/>

        <Route path="/teachersSquare" element={<TeachersSquare/>}/>
        <Route path="/about" element={<About/>}/>

        {/* dynamic routes */}
        <Route path="/order/:id" element={<OrderDetails/>}/>
        <Route path="/station/:id" element={<StationDetails/>}/>
      </Routes>
      <Footer/>
    </Router>
    </>
  )
}

export default App
