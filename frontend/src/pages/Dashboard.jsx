import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/userService";
import { saveLocation } from "../services/locationService";
import { getContacts } from "../services/contactService";
import { sendSOS, getSOSHistory } from "../services/sosService";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  getNearbyHospitals,
  calculateDistance,
} from "../services/hospitalService";

function Dashboard() {
  const { user, setUser } = useAuth();
  const [contactsCount, setContactsCount] = useState(0);
  const [location, setLocation] = useState(null);
  const [sosHistory, setSOSHistory] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [sosCountdown, setSOSCountdown] = useState(null);
  const [sosPending, setSOSPending] = useState(false);
  const [motionMagnitude, setMotionMagnitude] = useState(0);
  const [motionWorking, setMotionWorking] = useState(false);
  const [accidentDetected, setAccidentDetected] = useState(false);

  // handleMotion
  const handleMotion = (event) => {
    const acceleration = event.accelerationIncludingGravity;

    if (!acceleration) return;

    const x = acceleration.x || 0;
    const y = acceleration.y || 0;
    const z = acceleration.z || 0;

    const magnitude = Math.sqrt(x * x + y * y + z * z);

    setMotionWorking(true);
    setMotionMagnitude(magnitude);

    const ACCIDENT_THRESHOLD = 25;

    if (magnitude >= ACCIDENT_THRESHOLD) {
      setAccidentDetected(true);
    }
  };

  useEffect(() => {
    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  const fetchContactsCount = async () => {
    try {
      const contacts = await getContacts();
      setContactsCount(contacts.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(currentLocation);

        try {
          await saveLocation(currentLocation);
          console.log("Location Saved Successfully");
        } catch (error) {
          console.log(error);
          toast.error("Failed to save location");
        }
      },
      (error) => {
        console.log(error);
        alert("Unable to fetch location.");
      },
    );
  };

  // Countdown function
  const startSOSCountdown = () => {
    if (!location) {
      toast.error("Location not available");
      return;
    }

    if (sosPending) {
      return;
    }

    setSOSPending(true);
    setSOSCountdown(10);
  };

  useEffect(() => {
    if (sosCountdown === null) {
      return;
    }

    if (sosCountdown === 0) {
      setSOSCountdown(null);
      setSOSPending(false);

      handleSOS();

      return;
    }

    const timer = setTimeout(() => {
      setSOSCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sosCountdown]);

  // Cancel function
  const cancelSOS = () => {
    setSOSCountdown(null);
    setSOSPending(false);

    toast.success("SOS Cancelled");
  };

  const handleSOS = async () => {
    if (!location) {
      toast.error("Location not available");
      return;
    }

    if (hospitals.length === 0) {
      toast.error("Nearest hospital not available");
      return;
    }

    const nearestHospital = hospitals[0];

    try {
      await sendSOS(location, nearestHospital);

      toast.success("SOS Sent Successfully 🚨");
      await fetchSOSHistory();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to send SOS");
    }
  };

  const fetchNearbyHospitals = async () => {
    if (!location) return;
    console.log("Location for hospitals:", location);
    try {
      setLoadingHospitals(true);

      const data = await getNearbyHospitals(
        location.latitude,
        location.longitude,
      );

      const hospitalsWithDistance = data
        .map((hospital) => {
          const hospitalLatitude = hospital.lat ?? hospital.center?.lat;

          const hospitalLongitude = hospital.lon ?? hospital.center?.lon;

          if (
            hospitalLatitude === undefined ||
            hospitalLongitude === undefined
          ) {
            return null;
          }

          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            hospitalLatitude,
            hospitalLongitude,
          );

          return {
            ...hospital,
            distance,
            hospitalLatitude,
            hospitalLongitude,
          };
        })
        .filter(Boolean);

      // Nearest hospital first
      hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

      console.log("Hospitals Sorted by Distance:", hospitalsWithDistance);
      console.log("FIRST HOSPITAL:", hospitalsWithDistance[0]);
      console.log("HOSPITAL TAGS:", hospitalsWithDistance[0]?.tags);
      setHospitals(hospitalsWithDistance);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch nearby hospitals");
    } finally {
      setLoadingHospitals(false);
    }
  };

  const fetchSOSHistory = async () => {
    try {
      const data = await getSOSHistory();
      console.log("SOS HISTORY FROM BACKEND:", data);
      setSOSHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchContactsCount();
    fetchLocation();
    fetchSOSHistory();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyHospitals();
    }
  }, [location]);
  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user ? user.name : "Loading..."} 👋
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">📍 Live Location</h2>

            {location ? (
              <>
                <p className="text-gray-600">Latitude: {location.latitude}</p>

                <p className="text-gray-600">Longitude: {location.longitude}</p>
                <MapView location={location} />
              </>
            ) : (
              <p className="text-gray-600">Fetching location...</p>
            )}
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              👨‍👩‍👧 Emergency Contacts
            </h2>

            <p className="text-gray-600">Total Contacts: {contactsCount}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">📱 Motion Sensor</h2>

            <p className="text-gray-600">
              Status:{" "}
              {motionWorking ? (
                <span className="text-green-600 font-semibold">Working ✅</span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Waiting for sensor...
                </span>
              )}
            </p>

            <p className="text-gray-600 mt-2">
              Motion Magnitude: {motionMagnitude.toFixed(2)}
            </p>

            {accidentDetected && (
              <div className="mt-4 bg-red-100 border border-red-400 p-4 rounded-lg">
                <p className="text-red-700 font-bold">
                  🚨 POSSIBLE ACCIDENT DETECTED!
                </p>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">🚨 Emergency SOS</h2>

            {!sosPending ? (
              <button
                onClick={startSOSCountdown}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
              >
                🚨 Send SOS
              </button>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold text-red-600 mb-3">
                  🚨 SOS will be sent in
                </p>

                <p className="text-5xl font-bold text-red-600 mb-4">
                  {sosCountdown}
                </p>

                <button
                  onClick={cancelSOS}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                >
                  Cancel SOS
                </button>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              📜 Recent SOS History
            </h2>

            {sosHistory.length === 0 ? (
              <p className="text-gray-600">No SOS history found.</p>
            ) : (
              sosHistory.slice(0, 5).map((item) => (
                <div key={item._id} className="border rounded-lg p-4 mb-3">
                  <p className="font-medium">🚨 SOS Alert</p>

                  <p className="text-gray-600 mt-2">
                    📍 User Location: {item.latitude}, {item.longitude}
                  </p>

                  {item.hospitalName && (
                    <p className="text-gray-600 mt-1">
                      🏥 Nearest Hospital: {item.hospitalName}
                    </p>
                  )}

                  {item.hospitalDistance !== null &&
                    item.hospitalDistance !== undefined && (
                      <p className="text-gray-600 mt-1">
                        📏 Distance: {item.hospitalDistance.toFixed(2)} km
                      </p>
                    )}

                  {item.hospitalLatitude && item.hospitalLongitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${item.hospitalLatitude},${item.hospitalLongitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      🗺 Open Hospital Location
                    </a>
                  )}

                  <p className="text-sm text-gray-500 mt-3">
                    🕐 {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">🏥 Nearby Hospitals</h2>

            {loadingHospitals ? (
              <p className="text-gray-600">Finding nearby hospitals...</p>
            ) : hospitals.length === 0 ? (
              <p className="text-gray-600">No hospitals found.</p>
            ) : (
              hospitals.slice(0, 5).map((hospital) => (
                <div key={hospital.id} className="border rounded-lg p-4 mb-3">
                  <h3 className="font-semibold text-lg">
                    {hospital.tags?.name || "Unnamed Hospital"}
                  </h3>
                  {hospital.tags?.["addr:full"] && (
                    <p className="text-gray-600 mt-1">
                      🏠 {hospital.tags["addr:full"]}
                    </p>
                  )}
                  {hospital.tags?.["addr:postcode"] && (
                    <p className="text-gray-600 mt-1">
                      📮 {hospital.tags["addr:postcode"]}
                    </p>
                  )}

                  <p className="text-gray-600 mt-1">
                    📍 {hospital.distance.toFixed(2)} km away
                  </p>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${hospital.hospitalLatitude},${hospital.hospitalLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    🗺 Open in Google Maps
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-8 border rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-3">Emergency Contacts</h2>

          <Link
            to="/contacts"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Manage Contacts
          </Link>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
