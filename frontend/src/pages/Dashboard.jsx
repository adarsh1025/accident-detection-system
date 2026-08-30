import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
  const accidentTriggeredRef = useRef(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [accidentDetectionEnabled, setAccidentDetectionEnabled] =
    useState(false);
  const [rideActive, setRideActive] = useState(false);

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

    const ACCIDENT_THRESHOLD = 10;

    console.log("Magnitude:", magnitude);
    console.log("Ride Active:", rideActive);
    console.log("Detection Enabled:", accidentDetectionEnabled);
    console.log("Cooldown:", cooldownActive);
    console.log("Triggered Ref:", accidentTriggeredRef.current);

    if (
      rideActive &&
      accidentDetectionEnabled &&
      magnitude >= ACCIDENT_THRESHOLD &&
      !accidentTriggeredRef.current &&
      !cooldownActive
    ) {
      console.log("🚨 ACCIDENT CONDITION TRUE");
      accidentTriggeredRef.current = true;

      setAccidentDetected(true);

      // Automatic SOS countdown start
      setSOSPending(true);
      setSOSCountdown(10);

      toast.error("🚨 Possible Accident Detected!");
    }
  };

  // Toggle function

  const toggleAccidentDetection = () => {
    setAccidentDetectionEnabled((prev) => !prev);

    setAccidentDetected(false);
    accidentTriggeredRef.current = false;
  };

  // startRide function

  const startRide = () => {
    setRideActive(true);
    setAccidentDetectionEnabled(true);

    setAccidentDetected(false);
    accidentTriggeredRef.current = false;

    toast.success("🚗 Ride Started - Accident Detection ON");
  };

  // End Ride function

  const endRide = () => {
    setRideActive(false);
    setAccidentDetectionEnabled(false);

    setAccidentDetected(false);
    setSOSCountdown(null);
    setSOSPending(false);

    accidentTriggeredRef.current = false;

    toast.success("🏁 Ride Ended - Accident Detection OFF");
  };

  useEffect(() => {
    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [rideActive, accidentDetectionEnabled, cooldownActive]);

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
    setAccidentDetected(false);

    accidentTriggeredRef.current = false;

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
      setCooldownActive(true);

      setTimeout(() => {
        accidentTriggeredRef.current = false;
        setAccidentDetected(false);
        setCooldownActive(false);
      }, 30000);
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
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#160a24] via-[#0f0719] to-[#0a0512] text-[#f1e9ff]">
      {/* Background Pink Glow */}
      <div className="fixed -top-40 left-[60%] -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-b from-pink-500/30 to-purple-500/10 blur-3xl pointer-events-none"></div>

      {/* Background Cyan Glow */}
      <div className="fixed bottom-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>

      {/* Cyber Grid Background */}
      <div
        className="
        fixed
        inset-x-0
        bottom-0
        h-[45vh]
        opacity-[0.07]
        pointer-events-none
        [background-image:linear-gradient(rgba(63,240,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(63,240,255,0.5)_1px,transparent_1px)]
        [background-size:55px_55px]
      "
      ></div>

      {/* Existing Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
        {/* Dashboard Top Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Welcome Text */}
          <div>
            <p className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-pink-400">
              SafeRide AI 🚑
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {user ? user.name : "Loading..."}
              </span>{" "}
              👋
            </h1>

            {/* Small Gradient Line */}
            <div className="mt-4 h-[2px] w-28 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(236,72,153,0.5)]"></div>
          </div>

          {/* User Profile Pill */}
          <div className="self-start sm:self-auto">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl shadow-lg">
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-500 text-[#0a0512] font-bold shadow-[0_0_18px_rgba(63,240,255,0.25)]">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {/* User Name */}
              <div className="pr-3">
                <p className="text-sm font-semibold text-white">
                  {user ? user.name : "Loading..."}
                </p>

                <p className="text-xs text-gray-400">SafeRide AI</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#160a24]/70 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-pink-400/30 hover:shadow-[0_20px_60px_rgba(236,72,153,0.08)]">
            <h2 className="text-xl font-semibold mb-3 text-white">
              📍 Live Location
            </h2>

            {location ? (
              <>
                <p className="text-gray-400">
                  Latitude:{" "}
                  <span className="text-cyan-300 font-medium">
                    {location.latitude}
                  </span>
                </p>

                <p className="text-gray-400 mb-4">
                  Longitude:{" "}
                  <span className="text-cyan-300 font-medium">
                    {location.longitude}
                  </span>
                </p>
                <MapView location={location} />
              </>
            ) : (
              <p className="text-gray-400">Fetching location...</p>
            )}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#160a24]/70 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]">
            {/* Glow */}
            <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-4 text-white">
                👨‍👩‍👧 Emergency Contacts
              </h2>

              <p className="text-sm text-gray-400">Total Contacts</p>

              <p className="mt-1 text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {contactsCount}
              </p>
            </div>
          </div>

          {/* Ride Mode */}

          {/* Ride Mode */}

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#160a24]/70 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-pink-400/30 hover:shadow-[0_20px_60px_rgba(236,72,153,0.08)]">
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-white">
                  🚗 Ride Mode
                </h2>

                {/* Status Indicator */}
                <div
                  className={`h-3 w-3 rounded-full ${
                    rideActive
                      ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]"
                      : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.6)]"
                  }`}
                ></div>
              </div>

              <p className="text-gray-400 mb-5">
                Status:{" "}
                {rideActive ? (
                  <span className="text-green-400 font-semibold">
                    Ride Active 🟢
                  </span>
                ) : (
                  <span className="text-gray-400 font-semibold">
                    Ride Not Active 🔴
                  </span>
                )}
              </p>

              {!rideActive ? (
                <button
                  onClick={startRide}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-[#0a0512] font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] active:scale-[0.98]"
                >
                  🚗 Start Ride
                </button>
              ) : (
                <button
                  onClick={endRide}
                  className="w-full sm:w-auto border border-red-400/30 bg-red-500/10 text-red-300 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 hover:border-red-400/60 hover:shadow-[0_0_25px_rgba(248,113,113,0.15)] active:scale-[0.98]"
                >
                  🏁 End Ride
                </button>
              )}
            </div>
          </div>

          {/* Motion Sensor  */}

          {/* Motion Sensor */}

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#160a24]/70 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]">
            {/* Background Glow */}
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-white">
                  📱 Motion Sensor
                </h2>

                {/* Sensor Indicator */}
                <div
                  className={`h-3 w-3 rounded-full ${
                    motionWorking
                      ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]"
                      : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.6)]"
                  }`}
                ></div>
              </div>

              {/* Sensor Status */}
              <p className="text-gray-400">
                Status:{" "}
                {motionWorking ? (
                  <span className="text-green-400 font-semibold">
                    Working ✅
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold">
                    Waiting for sensor...
                  </span>
                )}
              </p>

              {/* Motion Magnitude */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                  Motion Magnitude
                </p>

                <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {motionMagnitude.toFixed(2)}
                </p>
              </div>

              {/* Accident Detection Toggle */}
              <button
                onClick={toggleAccidentDetection}
                className={`mt-5 w-full sm:w-auto px-5 py-3 rounded-xl font-bold transition-all duration-300 active:scale-[0.98] ${
                  accidentDetectionEnabled
                    ? "border border-green-400/30 bg-green-500/10 text-green-300 hover:bg-green-500/20 hover:shadow-[0_0_25px_rgba(74,222,128,0.12)]"
                    : "border border-white/10 bg-white/[0.05] text-gray-300 hover:border-pink-400/30 hover:bg-pink-500/10"
                }`}
              >
                {accidentDetectionEnabled
                  ? "🟢 Accident Detection ON"
                  : "🔴 Accident Detection OFF"}
              </button>

              {/* Accident Warning */}
              {accidentDetected && (
                <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 shadow-[0_0_25px_rgba(248,113,113,0.08)]">
                  <p className="font-bold text-red-300">
                    🚨 POSSIBLE ACCIDENT DETECTED!
                  </p>
                </div>
              )}

              {/* Cooldown */}
              {cooldownActive && (
                <div className="mt-4 rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-3">
                  <p className="text-orange-300 font-semibold">
                    ⏳ Accident detection cooldown active...
                  </p>
                </div>
              )}
            </div>
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
    </div>
  );
}

export default Dashboard;
