import React, { useEffect, useCallback, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { SERVER_URL } from "../../constants/SERVER_URL";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Table,
  Modal,
} from "flowbite-react";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";

export default function AccepetedEmergecyOrders() {
  const [isError, setError] = useState(null);
  const [emergencyOrders, setEmergencyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  //get accepted emergency orders
  const getAcceptedEmergencyOrders = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/order/emergency/status/accepted`
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setEmergencyOrders(data.Orders);
      } else {
        setOutdatedRecord(true);
        throw new data.error() || "Error fetching students value";
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  // use effect
  useEffect(() => {
    getAcceptedEmergencyOrders();
  }, []);

  //toggle height
  const toggleHeight = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <div className="flex justify-between gap-4 w-[95%]  mx-auto">
        <div className="">
          <Sidebar />
        </div>
        <div className="flex-1 gap-4 mt-4">
          {/* Teachers div */}
          <div
            className={`bg-gray-200 p-1 rounded-md overflow-hidden ${
              showAll ? "h-[500px]" : "h-auto"
            }`}
          >
            <div className="flex justify-between bg-gray-200 rounded-md p-2">
              <h2 className="mx-auto p-2 text-left text-lg text-green-700">
                Accepted Emergency Orders{" "}
                <span className="pl-10 text-green-700">
                  {" "}
                  ( {emergencyOrders?.length} )
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Client Name</Table.HeadCell>
                  <Table.HeadCell>Client Phone</Table.HeadCell>
                  <Table.HeadCell>Fuel Type</Table.HeadCell>
                  <Table.HeadCell>Fuel Volume</Table.HeadCell>
                  <Table.HeadCell>Urgency</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {emergencyOrders?.length > 0 &&
                    emergencyOrders?.map((order) => (
                      <Table.Row
                        key={order._id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {order?.clientName}
                        </Table.Cell>
                        <Table.Cell className="text-black">
                          {order?.clientPhone}
                        </Table.Cell>
                        <Table.Cell className="text-black">
                          {order?.fuelType}
                        </Table.Cell>
                        <Table.Cell className="text-black">
                          {order?.fuelVolume}
                        </Table.Cell>
                        <Table.Cell className="text-black">
                          {order?.urgency}
                        </Table.Cell>
                        <Table.Cell className="text-black">
                          {order?.status}
                        </Table.Cell>
                        <Table.Cell className="text-black">
                          <Link
                            to={`/order/${order._id}`}
                            className="font-medium text-green-700 hover:text-red-600 hover:underline"
                          >
                            View
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
            <div className="bg-white p-3">
              {loading && (
                <>
                  <Spinner size="sm" />
                  <span className="ml-3">Loading...</span>
                </>
              )}
              {isError && (
                <Alert className="mt-4" color="failure">
                  {isError}
                </Alert>
              )}
            </div>
          </div>
          <div className="z-50 relative p-3 rounded-md border-b-2 border-gray-300">
            <Label
              onClick={toggleHeight}
              className="text-white bg-cyan-900 p-2 mt-3 rounded-md"
              gradientDuoTone="pinkToOrange"
              outline
            >
              {showAll ? "Show All" : "Show Less"}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
