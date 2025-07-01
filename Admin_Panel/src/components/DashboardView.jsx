import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Label } from "flowbite-react";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../constants/SERVER_URL";
import "react-calendar/dist/Calendar.css";
import { RiGasStationFill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { GoAlert } from "react-icons/go";
import { FcApproval } from "react-icons/fc";
import { CiNoWaitingSign } from "react-icons/ci";
import { ImCross } from "react-icons/im";

export default function DashboardView() {
  const { currentUser } = useSelector((state) => state.user);
  const [welcomeText, setWelcomeText] = useState("Welcome Back");

  const [stationsCount, setStationsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [approvedStationsCount, setApprovedStationsCount] = useState(0);
  const [notApprovedStationsCount, setNotApprovedStationsCount] = useState(0);
  const [emergencyOrdersCount, setEmergencyOrdersCount] = useState(0);
  const [pendingEmergencyOrders, setPendingEmergencyOrders] = useState(0);
  const [cancelledEmergencyOrders, setCancelledEmergencyOrders] = useState(0);
  const [assignedEmergencyOrders, setAssignedEmergencyOrders] = useState(0);
  const [outdatedRecord, setOutdatedRecord] = useState(true);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const getStationsCount = async () => {
    const response = await fetch(`${SERVER_URL}/api/v1/Station/all`);
    const data = await response.json();
    if (response.ok) {
      setStationsCount(data.totalStations);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  const getOrdersCount = async () => {
    const response = await fetch(`${SERVER_URL}/api/v1/order/all`);
    const data = await response.json();
    if (response.ok) {
      setOrdersCount(data.totalOrders);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  const getApprovedStationsCount = async () => {
    const response = await fetch(`${SERVER_URL}/api/v1/station/approved`);
    const data = await response.json();
    if (response.ok) {
      setApprovedStationsCount(data.totalStations);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  const getNotApprovedStationsCount = async () => {
    const response = await fetch(`${SERVER_URL}/api/v1/station/not-approved`);
    const data = await response.json();
    if (response.ok) {
      setNotApprovedStationsCount(data.totalStations);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  const getStudents = async () => {
    const response = await fetch(`${SERVER_URL}/api/users/studentsCount`);
    const data = await response.json();
    if (!response.ok) setOutdatedRecord(true);
  };

  const getEmergencyOrdersCount = async () => {
    const response = await fetch(`${SERVER_URL}/api/v1/order/emergency/all`);
    const data = await response.json();
    if (response.ok) {
      setEmergencyOrdersCount(data.totalOrders);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  const getPendingEmergencyOrders = async () => {
    const response = await fetch(
      `${SERVER_URL}/api/v1/order/emergency/status/pending`
    );
    const data = await response.json();
    if (response.ok) {
      setPendingEmergencyOrders(data.totalOrders);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  const getAssignedEmergencyOrders = async () => {
    const response = await fetch(
      `${SERVER_URL}/api/v1/order/emergency/status/accepted`
    );
    const data = await response.json();
    if (response.ok) {
      setAssignedEmergencyOrders(data.totalOrders);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  const getCancelledEmergencyOrders = async () => {
    const response = await fetch(
      `${SERVER_URL}/api/v1/order/emergency/status/rejected`
    );
    const data = await response.json();
    if (response.ok) {
      setCancelledEmergencyOrders(data.totalOrders);
      setOutdatedRecord(false);
    } else {
      setOutdatedRecord(true);
    }
  };

  useEffect(() => {
    const getTimeOfDay = () => {
      const hours = new Date().getHours();
      if (hours < 12) return "Good Morning";
      if (hours < 18) return "Good Afternoon";
      return "Good Evening";
    };

    setWelcomeText(getTimeOfDay());

    getStationsCount();
    getOrdersCount();
    getApprovedStationsCount();
    getNotApprovedStationsCount();
    getStudents();
    getEmergencyOrdersCount();
    getPendingEmergencyOrders();
    getAssignedEmergencyOrders();
    getCancelledEmergencyOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-50">
        {welcomeText} {currentUser?.user?.username || "Admin"}!
      </h2>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Component */}
        {[
          {
            icon: <RiGasStationFill className="mx-auto h-12 w-12 text-cyan-600" />,
            label: "Total Stations",
            count: stationsCount,
            text: "All registered stations",
            error: "Error fetching stations!",
          },
          {
            icon: <FaShoppingCart className="mx-auto h-12 w-12 text-green-600" />,
            label: "Total Orders",
            count: ordersCount,
            text: "Orders via the app",
            error: "Error fetching orders!",
            link: "/AllNormalOrders",
          },
          {
            icon: <GoAlert className="mx-auto h-12 w-12 text-red-600" />,
            label: "Emergency Requests",
            count: emergencyOrdersCount,
            text: "All emergency requests",
            error: "Outdated record!",
            link: "/EmergencyRequests",
          },
        ].map(({ icon, label, count, text, error, link }, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow hover:shadow-md transition"
          >
            {icon}
            <h3 className="mt-4 text-center text-lg font-medium">{label}</h3>
            <p className="mt-2 text-center text-4xl font-bold text-gray-800">
              {count || 0}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <p
                className={`text-sm ${
                  outdatedRecord ? "text-red-600" : "text-gray-500"
                }`}
              >
                {outdatedRecord ? error : text}
              </p>
              {link && (
                <Link
                  to={link}
                  className="text-cyan-700 hover:text-cyan-900 text-sm font-semibold"
                >
                  View &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Order Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rejected, Pending, Accepted */}
        {[
          {
            icon: <ImCross className="mx-auto h-12 w-12 text-red-600" />,
            label: "Rejected Emergency Orders",
            count: cancelledEmergencyOrders,
            text: "All rejected orders",
            link: "/RejectedEmergencyRequests",
          },
          {
            icon: <CiNoWaitingSign className="mx-auto h-12 w-12 text-yellow-500" />,
            label: "Pending Emergency Orders",
            count: pendingEmergencyOrders,
            text: "All pending orders",
            link: "/PendingEmergencyRequests",
          },
          {
            icon: <FcApproval className="mx-auto h-12 w-12" />,
            label: "Accepted Emergency Orders",
            count: assignedEmergencyOrders,
            text: "All accepted orders",
            link: "/AcceptedEmergencyRequests",
          },
        ].map(({ icon, label, count, text, link }, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow hover:shadow-md transition"
          >
            {icon}
            <h3 className="mt-4 text-center text-lg font-medium">{label}</h3>
            <p className="mt-2 text-center text-4xl font-bold text-gray-800">
              {count}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <p
                className={`text-sm ${
                  outdatedRecord ? "text-red-600" : "text-gray-500"
                }`}
              >
                {outdatedRecord ? "Outdated record!" : text}
              </p>
              <Link
                to={link}
                className="text-cyan-700 hover:text-cyan-900 text-sm font-semibold"
              >
                View &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Station Approval Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: <FcApproval className="mx-auto h-12 w-12" />,
            label: "Approved Stations",
            count: approvedStationsCount,
            text: "All approved stations",
            link: "/ApprovedStations",
          },
          {
            icon: <CiNoWaitingSign className="mx-auto h-12 w-12 text-yellow-500" />,
            label: "Pending Station Approvals",
            count: notApprovedStationsCount,
            text: "Stations awaiting approval",
            link: "/PendingApprovals",
          },
        ].map(({ icon, label, count, text, link }, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow hover:shadow-md transition"
          >
            {icon}
            <h3 className="mt-4 text-center text-lg font-medium">{label}</h3>
            <p className="mt-2 text-center text-4xl font-bold text-gray-800">
              {count}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <p
                className={`text-sm ${
                  outdatedRecord ? "text-red-600" : "text-gray-500"
                }`}
              >
                {outdatedRecord ? "Outdated record!" : text}
              </p>
              <Link
                to={link}
                className="text-cyan-700 hover:text-cyan-900 text-sm font-semibold"
              >
                View &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
