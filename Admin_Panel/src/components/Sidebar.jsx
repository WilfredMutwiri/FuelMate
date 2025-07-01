import { useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import { MdDashboard } from "react-icons/md";
import { MdOutlineEmergency } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { RiGasStationFill } from "react-icons/ri";
import { CiNoWaitingSign } from "react-icons/ci";

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [menuVisible, setMenuVisible] = useState(true);

  const handleToggleMenu = () => setMenuVisible(!menuVisible);
  const handleSignout = async () => navigate("/Landing");

  return (
    <div>
      <div
        className={`flex flex-col justify-between mt-4 bg-gray-950 rounded-lg shadow-lg w-60 mb-5 md:mb-0 ${
          menuVisible ? "block" : "hidden"
        }`}
      >
        {/* Logo & Brand */}
        <Link to="/admin">
          <div className="p-6 flex flex-col items-center">
            <img
              className="w-24 h-24 rounded-full border-2 border-gray-50"
              src={logo}
              alt="logo"
            />
            <h2 className="text-xl font-semibold text-gray-100 mt-3">FuelMate</h2>
            <p className="text-xs italic text-gray-400 text-center mt-1">
              Your Fuel, Delivered Anywhere, Anytime
            </p>
          </div>
        </Link>

        {/* Menu */}
        <div className="border-t border-gray-700 px-4 py-5">
          <ul className="flex flex-col gap-3">
            <Link to="/admin">
              <li className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700 hover:text-white transition text-gray-300 cursor-pointer">
                <MdDashboard className="text-lg" />
                <span className="text-sm font-medium">Dashboard</span>
              </li>
            </Link>

            <Link to="/EmergencyRequests">
              <li className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700 hover:text-white transition text-gray-300 cursor-pointer">
                <MdOutlineEmergency className="text-lg" />
                <span className="text-sm font-medium">Emergency Requests</span>
              </li>
            </Link>

            <Link to="/ApprovedStations">
              <li className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700 hover:text-white transition text-gray-300 cursor-pointer">
                <FcApproval className="text-lg" />
                <span className="text-sm font-medium">Approved Stations</span>
              </li>
            </Link>

            <Link to="/PendingApprovals">
              <li className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700 hover:text-white transition text-gray-300 cursor-pointer">
                <CiNoWaitingSign className="text-lg" />
                <span className="text-sm font-medium">Pending Approvals</span>
              </li>
            </Link>

            <Link to="/RegisteredStations">
              <li className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700 hover:text-white transition text-gray-300 cursor-pointer">
                <RiGasStationFill className="text-lg" />
                <span className="text-sm font-medium">Registered Stations</span>
              </li>
            </Link>
          </ul>
          <Button
            className="w-full mt-5"
            color="failure"
            size="sm"
            onClick={handleSignout}
          >
            Exit
          </Button>
        </div>

        {/* Close button on small screens */}
        <IoMdClose
          className="text-gray-400 text-2xl my-4 mx-auto cursor-pointer md:hidden hover:text-red-500"
          onClick={handleToggleMenu}
        />
      </div>
    </div>
  );
};

export default Sidebar;
