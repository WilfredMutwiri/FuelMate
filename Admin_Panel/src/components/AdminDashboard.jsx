import { IoMdClose } from "react-icons/io";
import logo from "../assets/logo.webp";
import { useDispatch } from "react-redux";
import { FaCaretDown } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdOutlineEmergency } from "react-icons/md";
import { RiGasStationFill } from "react-icons/ri";
import { FcApproval } from "react-icons/fc";
import { useState } from "react";
import { Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../constants/SERVER_URL";
import { signoutSuccess } from "../../Redux/User/userSlice";
import DashboardView from "./DashboardView.jsx";
import { CiNoWaitingSign } from "react-icons/ci";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visibleSection, setVisibleSection] = useState("dashboard");
  const [menuVisible, setMenuVisible] = useState(true);

  const handleRevealMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleCloseMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const showSection = (section) => {
    setVisibleSection(section);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(SERVER_URL + "/api/v1/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
      navigate("/Landing");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-gray-500 min-h-screen pt-5 pb-5">
      <div className="w-full md:hidden flex justify-between items-center p-4">
        <FaCaretDown
          className="text-3xl text-gray-300"
          onClick={handleRevealMenu}
        />
        <h2 className="text-lg font-semibold text-gray-200">FuelMate Admin</h2>
      </div>

      <section>
        <div className="flex flex-col md:flex-row w-[95%] mx-auto mt-6 gap-6">
          {/* Sidebar */}
          <div
            className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg transform transition-transform duration-200 ease-in-out md:block ${
              menuVisible ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col items-center p-5">
              <a href="/admin" className="flex flex-col items-center">
                <img
                  src={logo}
                  alt="FuelMate Logo"
                  className="w-24 h-24 rounded-full border-2 border-gray-50"
                />
                <h2 className="mt-3 text-xl font-semibold text-gray-100">
                  FuelMate
                </h2>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Your Fuel, Delivered Anywhere, Anytime
                </p>
              </a>
            </div>

            <nav className="mt-4 px-3 pb-4">
              <ul className="flex flex-col gap-2">
                <li
                  onClick={() => showSection("dashboard")}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-cyan-400 transition text-gray-300 font-medium"
                >
                  <MdDashboard className="text-xl" />
                  Dashboard
                </li>

                <Link to="/EmergencyRequests">
                  <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-cyan-400 transition text-gray-300 font-medium">
                    <MdOutlineEmergency className="text-xl" />
                    Emergency Requests
                  </li>
                </Link>

                <Link to="/ApprovedStations">
                  <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-cyan-400 transition text-gray-300 font-medium">
                    <FcApproval className="text-xl" />
                    Approved Stations
                  </li>
                </Link>

                <Link to="/PendingApprovals">
                  <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-cyan-400 transition text-gray-300 font-medium">
                    <CiNoWaitingSign className="text-xl" />
                    Pending Approvals
                  </li>
                </Link>

                <Link to="/RegisteredStations">
                  <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-cyan-400 transition text-gray-300 font-medium">
                    <RiGasStationFill className="text-xl" />
                    Registered Stations
                  </li>
                </Link>
              </ul>
              <Button
                className="w-full mt-6"
                color="failure"
                onClick={handleSignout}
              >
                Exit
              </Button>
            </nav>

            <IoMdClose
              className="text-2xl text-gray-400 mx-auto mb-3 md:hidden cursor-pointer"
              onClick={handleCloseMenu}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {visibleSection === "dashboard" && <DashboardView />}
          </div>
        </div>
      </section>
    </div>
  );
}
