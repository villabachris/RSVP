import React, { useState, useEffect } from "react";
import VantaBirds from "./VantaBirds";
import { motion } from "framer-motion";

export default function DebutantRSVP() {
  const [rsvp, setRsvp] = useState(null);
  const [flipped, setFlipped] = useState(false);
//   const [guestName, setGuestName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [responses, setResponses] = useState([]);
  const [adminView, setAdminView] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6GA-aebhvdytT48ZjHXYoX9EPh6FXH-pGSnKY7hHVNQhIu1tBBbEHnBVqtYWQcJyb/exec";
  const SPREADSHEET_ID = "1nxTF5sLo9Dmey-rdl6rk5hShjPOP66iAknrEp2k8nxQ";
  const GOOGLE_API_KEY = "AIzaSyDaCi6kZDq9HG1DHa_80tT9Wnzt5f1wC18";

  const handleRSVP = async (response) => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const fullName = `${trimmedFirst} ${trimmedLast}`.trim();

    if (!trimmedFirst || !trimmedLast) {
        alert("Please enter both first and last name");
        return;
    }

    const storedResponses = JSON.parse(sessionStorage.getItem("guestResponses") || "[]");

    const nameExists = storedResponses.some(
        ([name]) => name.toLowerCase() === fullName.toLowerCase()
    );

    if (nameExists) {
        alert("This name has already submitted an RSVP.");
        return;
    }
    setRsvp(response);
    setFlipped(true);

    try {
      await fetch(WEB_APP_URL, {
        mode: "no-cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, response }),
      });
    } catch (error) {
      console.error("Failed to send RSVP:", error);
      alert("Failed to send RSVP, please try again.");
    }
  };

  const fetchResponses = async () => {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Guest_Response?key=${GOOGLE_API_KEY}`
    );
    const data = await res.json();

    if (!data.values || data.values.length <= 1) {
      setResponses([]);
      sessionStorage.setItem("guestResponses", JSON.stringify([]));
      return;
    }

    const guestData = data.values.slice(1);
    setResponses(guestData);
    sessionStorage.setItem("guestResponses", JSON.stringify(guestData));
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    alert("Failed to load guest responses.");
  }
};

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setAdminView(false);
    setResponses([]);
  };

  useEffect(() => {
    fetchResponses();
}, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center p-6 overflow-hidden">
      <VantaBirds />
      <div
        className="absolute inset-0 z-0 bg-center bg-cover opacity-40 pointer-events-none"
        style={{
          backgroundImage: "url('/jas2.png')", // Replace with your file path
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-full "></div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-96 h-96 bg-pink-400 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow left-[-10%] top-[-10%]" />
          <div className="absolute w-96 h-96 bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow right-[-10%] bottom-[-10%]" />
        </div>
      </div>

      {!flipped && !adminView && (
        <div className="z-10 max-w-xl text-center mb-10">
          <h2 className="text-5xl font-bold text-purple-700 mb-4">Hi there! Jasmine is</h2>
          <p className="text-lg text-pink-100">
            celebrating her 18th birthday in elegance and grace. Join us as we honor her transition into adulthood with an unforgettable night filled with love, laughter, and memories.
          </p>
        </div>
      )}

      {!adminView && (
        <motion.div
          className="perspective w-full max-w-md z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative w-full"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div className="absolute w-full backface-hidden">
              <div className="text-center shadow-2xl rounded-3xl p-8 bg-white bg-opacity-80 backdrop-blur-md border border-pink-200">
                <h1 className="text-4xl font-extrabold text-pink-700 mb-4 tracking-wide">
                  You're Invited!
                </h1>
                <p className="mb-4 text-gray-800 text-lg">
                  Join us for the magical 18th debut of Jasmine
                </p>
                <div className="mb-4">
                    <input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border border-pink-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                    <input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border border-pink-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => handleRSVP("attending")}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full shadow-md"
                  >
                    Will Attend
                  </button>
                  <button
                    onClick={() => handleRSVP("not attending")}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-full shadow-md"
                  >
                    Not Attending
                  </button>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="absolute w-full backface-hidden rotate-y-180">
              <div className="text-center shadow-2xl rounded-3xl p-8 bg-white bg-opacity-80 backdrop-blur-md border border-green-200">
                <h2 className="text-3xl text-green-700 font-semibold mb-4">Thank you!</h2>
                <p className="text-gray-800 text-lg">
                  {firstName} {lastName}, you have responded: {rsvp === "attending" ? "Will Attend" : "Not Attending"}
                </p>
              </div>
            <div className="z-10 bg-white bg-opacity-80 backdrop-blur-md border border-pink-200 rounded-xl shadow-lg p-6 mb-10 mt-10 text-center max-w-lg w-full">
                <h3 className="text-2xl font-bold text-pink-700 mb-2">Event Details</h3>
                <p className="text-gray-800 mb-1">
                📍 <strong>Venue:</strong> Blue Gardens Wedding and Events Venue
                </p>
                <p className="text-gray-800 mb-1">
                📅 <strong>Date:</strong> July 06, 2025
                </p>
                <p className="text-gray-800 mb-1">
                🕕 <strong>Time:</strong> 4:00 PM
                </p>
                <a
                href="https://www.google.com/maps/place/Blue+Gardens+Wedding+and+Events+Venue/@NaN,NaN,NaNa,NaNy,NaNt/data=!3m1!1e3!4m10!1m2!2m1!1sBlue+Garden!3m6!1s0x3397b755c9741e83:0x394d8d6a9c811c6e!8m2!3d14.6756131!4d121.0769967!15sCgtCbHVlIEdhcmRlbpIBC2V2ZW50X3ZlbnVlqgFEEAEqDyILYmx1ZSBnYXJkZW4oADIeEAEiGqv31P1oUMo88JTTYdtTCmnkLkC6dm4YLkxxMg8QAiILYmx1ZSBnYXJkZW7gAQA!16s%2Fg%2F1vp6xqt2?entry=ttu&g_ep=EgoyMDI1MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline mt-2 block"
                >
                View on Google Maps
                </a>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="z-10 mt-12 w-full max-w-xl">
        
        
        {adminView && adminAuthenticated && (
          <div className="p-6 bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-pink-700 mb-4 text-center">Guest Responses</h3>
            {responses.length === 0 ? (
              <p className="text-center text-gray-600">No responses yet.</p>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {responses.map(([name, response], idx) => (
                  <li
                    key={idx}
                    className="flex justify-between border-b pb-1 text-gray-700"
                  >
                    <span>{name}</span>
                    <span className={response === "attending" ? "text-green-600" : "text-red-500"}>
                      {response}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex justify-between">
              <button
                onClick={fetchResponses}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
              >
                Refresh
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      

      {/* CSS styles */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .animate-gradient-slow {
          animation: gradientShift 15s ease infinite;
          background-size: 400% 400%;
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-pulse-slow {
          animation: pulse 6s infinite ease-in-out;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
