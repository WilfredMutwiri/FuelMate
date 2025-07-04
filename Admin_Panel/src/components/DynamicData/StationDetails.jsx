import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../constants/SERVER_URL";
import { Spinner } from "../spinner";
import { Button } from "flowbite-react";
import useToast from "../../components/Toast";

const StationDetails = () => {
  const { show } = useToast();
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stationStats, setStationStats] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  useEffect(() => {
    const fetchStationDetails = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/v1/station/${id}`);
        const data = await res.json();
        if (res.ok) {
          setStation(data);
        } else {
          throw new Error(data.message || "Error fetching station info");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStationDetails();
  }, [id]);

  // update station status

  const updateStationStatus = async (newStatus) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/v1/station/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setStation((prev) => ({
          ...prev,
          station: { ...prev.station, newStatus },
        }));
        window.location.reload();
        show("Station updated successfully", "success");
      } else {
        show("Error updating station status", "error");
        throw new Error(data.message || "Error updating station status");
      }
    } catch (error) {
      show(error.message, "error");
      setError(error.message);
    }
  };

  // delete station
  const deleteStation = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this station? This action cannot be undone."
      )
    ) {
      try {
        const res = await fetch(`${SERVER_URL}/api/v1/station/delete/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok) {
          show("Station deleted successfully", "success");
          window.location.href = "/RegisteredStations";
        } else {
          show("Error deleting station", "error");
          throw new Error(data.message || "Error deleting station");
        }
      } catch (error) {
        show(error.message, "error");
      }
    }
  };

  // station orders
  useEffect(() => {
    const getDeliveredOrders = async () => {
      if (!id) {
        console.log("station ID not yet available");
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(
          `${SERVER_URL}/api/v1/order/delivered/station/${id}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setDeliveredOrders(data.totalOrders);
        }
      } catch (error) {
        console.log("an error occured", error.message);
        ToastComponent("error", error.message);
      }
    };
    getDeliveredOrders();
  }, []);

  // get total station sales
  useEffect(() => {
    const getStationSales = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${SERVER_URL}/api/v1/order/revenue/station/${id}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTotalSales(data.totalAmount);
        }
      } catch (error) {
        console.log("an error occured", error.message);
        ToastComponent("error", error.message);
      }
    };
    getStationSales();
  }, []);

  //fetching the station stats-likes-dislikes
  useEffect(() => {
    const getStationStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${SERVER_URL}/api/v1/station/${id}/stats`, {
          method: "GET",
        });
        const data = await res.json();
        console.log("data is", data);
        if (res.ok) {
          setStationStats(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getStationStats();
  }, [id]);

  console.log("station data", station);

  if (loading)
    return (
      <div className="  w-80 mx-auto flex gap-4">
        <p>{<Spinner />}</p>
        <p className="my-auto font-semibold text-cyan-700">
          Loading station's details...
        </p>
      </div>
    );
  if (error)
    return (
      <p className="text-red-600 text-center font-semibold">
        Error fetching station's details!
      </p>
    );

  return (
    <div>
      <div className="w-11/12 mx-auto bg-white">
        <h1 className="text-center pb-2 text-xl text-cyan-600">Station Info</h1>
        <div className="flex flex-row border border-cyan-300 gap-4">
          <div className="flex-1">
            <img
              src={station?.station?.profileImg}
              className="w-[500px] h-[500px] object-cover"
            />
          </div>
          <div className="border-r-2 pl-4 pr-4 flex-1">
            <ul className="flex flex-col gap-4 pt-4">
              <li>
                Station Name:{" "}
                <span className="demographyLi">
                  {station?.station?.username}
                </span>
              </li>
              <li>
                Station Registration No:{" "}
                <span className="demographyLi">{station?.station?.RegNo}</span>
              </li>
              <li>
                Location:{" "}
                <span className="demographyLi">
                  {station?.station?.county} - {station?.station?.town}
                </span>
              </li>
              <li>
                Email:{" "}
                <span className="demographyLi">{station?.station?.email}</span>
              </li>
              <li>
                Registation Certificate:{" "}
                <a
                  href={station?.station?.BusinessCert}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demographyLi"
                >
                  Reg_Certificate
                </a>
              </li>
              <li>
                Fuel Available:
                <ul className="ml-4 mt-2 flex flex-col gap-2">
                  {station?.station?.fuel?.length > 0 ? (
                    station.station.fuel.map((f) => (
                      <li key={f._id}>
                        <span className="demographyLi">
                          {f.type?.toLowerCase()} - Ksh: {f.price}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="text-gray-500">
                        No fuel info available
                      </span>
                    </li>
                  )}
                </ul>
              </li>

              <li>
                Services Available:
                <ul className="ml-4 mt-2 flex flex-col gap-2">
                  {station?.station?.services?.length > 0 ? (
                    station.station?.services?.map((s) => (
                      <li key={s._id}>
                        <span className="demographyLi">{s?.toLowerCase()}</span>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="text-gray-500">
                        No fuel info available
                      </span>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
          <div className="pl-4 pr-4 flex-1">
            <ul className="flex flex-col gap-4 pt-4">
              <li>
                Station Phone No:{" "}
                <span className="demographyLi">
                  {station?.station?.phoneNo}
                </span>
              </li>
              <li>
                Physical Address :{" "}
                <span className="demographyLi">
                  {station?.station?.physicalAddress}
                </span>
              </li>
              <li>
                Registered At:{" "}
                <span className="demographyLi">
                  {station?.station?.createdAt}
                </span>
              </li>
              <li>
                Station Rating:{" "}
                <span className="demographyLi">{station?.station?.rating}</span>
                <ul>
                  <li>
                    Stars Rating{" "}
                    <span className="demographyLi">
                      {stationStats?.starsRating} out of 5
                    </span>
                  </li>
                  <li>
                    Total Likes{" "}
                    <span className="demographyLi">
                      {" "}
                      {stationStats?.likes || 0}
                    </span>
                  </li>
                  <li>
                    Total Dislikes
                    <span className="demographyLi">
                      {" "}
                      {stationStats?.dislikes || 0}
                    </span>
                  </li>
                </ul>
              </li>
              <li>
                Total Delivered Orders:{" "}
                <span className="demographyLi">{deliveredOrders}</span>
              </li>
              <li>
                Total Station Sales:{" "}
                <span className="demographyLi">{totalSales}</span>
              </li>
              <li>
                Station Status:{" "}
                <span className="demographyLi">{station?.station?.status}</span>
              </li>
            </ul>
            <div className="pt-16">
              <h2>
                The Station is currently{" "}
                <span className="text-cyan-700">
                  {station?.station?.isOpen ? "Open!" : "Closed!"}
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between p-3 gap-6 w-10/12 mx-auto mt-4">
            {/* lower buttons */}
          </div>
          <div className="w-5/12 mx-auto pt-4 flex gap-6 align-middle justify-center">
            <Button
              color={
                station?.station?.status === "Approved" ? "warning" : "success"
              }
              onClick={() =>
                updateStationStatus(
                  station?.station?.status === "Approved"
                    ? "Not Approved"
                    : "Approved"
                )
              }
            >
              {station?.station?.status === "Approved"
                ? "Revoke Approval"
                : "Approve"}
            </Button>
            <Button className="bg-red-700" onClick={deleteStation}>
              Delete Station
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetails;
