import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Signup from "./components/signup"
import SignIn from "./components/Signin"
import AdminDashboard from "./components/AdminDashboard"
import NavBar from "./components/NavBar"
import Footer from "./components/FooterComp"
import Landing from "./components/Landing"
import ManageTeachers from "./components/Manage_Database/ManageTeachers"
import Dashboard from "./components/Dashboard"
import ManageParents from "./components/Manage_Database/ManageParents"
import ManageWorkers from "./components/Manage_Database/ManageWorkers"
import TeachersSquare from "./components/Messages/TeachersSquare"
import ManageStudents from "./components/Manage_Database/ManageStudents"
import About from "./components/About"
import TeacherDetails from "./components/DynamicData/TeacherDetails"
import WorkerDetails from "./components/DynamicData/WorkerDetails"
import StudentDetails from "./components/DynamicData/StudentDetails"
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
        <Route path="/ManageTeachers" element={<ManageTeachers/>}/>
        <Route path="/manageParents" element={<ManageParents/>}/>
        <Route path="/manageWorkers" element={<ManageWorkers/>}/>
        <Route path="/manageStudents" element={<ManageStudents/>}/>
        <Route path="/teachersSquare" element={<TeachersSquare/>}/>
        <Route path="/about" element={<About/>}/>

        {/* dynamic routes */}
        <Route path="/teacher/:id" element={<TeacherDetails/>}/>
        <Route path="/worker/:id" element={<WorkerDetails/>}/>
        <Route path="/student/:id" element={<StudentDetails/>}/>
      </Routes>
      <Footer/>
    </Router>
    </>
  )
}

export default App
