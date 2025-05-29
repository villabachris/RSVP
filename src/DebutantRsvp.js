import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DebutantRSVP() {
  const [rsvp, setRsvp] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [responses, setResponses] = useState([]);
  const [adminView, setAdminView] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6GA-aebhvdytT48ZjHXYoX9EPh6FXH-pGSnKY7hHVNQhIu1tBBbEHnBVqtYWQcJyb/exec";
  const SPREADSHEET_ID = "1nxTF5sLo9Dmey-rdl6rk5hShjPOP66iAknrEp2k8nxQ";
  const GOOGLE_API_KEY = "AIzaSyDaCi6kZDq9HG1DHa_80tT9Wnzt5f1wC18";

  const handleRSVP = async (response) => {
    if (!guestName.trim()) {
      alert("Please enter your name");
      return;
    }
    setRsvp(response);
    setFlipped(true);

    try {
      await fetch(WEB_APP_URL, {
        mode: "no-cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName.trim(), response }),
      });
    } catch (error) {
      console.error("Failed to send RSVP:", error);
      alert("Failed to send RSVP, please try again.");
    }
  };

  const fetchResponses = async () => {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1?key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();

      if (!data.values || data.values.length <= 1) {
        setResponses([]);
        return;
      }
      setResponses(data.values.slice(1));
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
    if (adminAuthenticated && adminView) {
      fetchResponses();
    }
  }, [adminAuthenticated, adminView]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 animate-gradient-slow"></div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-96 h-96 bg-pink-400 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow left-[-10%] top-[-10%]" />
          <div className="absolute w-96 h-96 bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow right-[-10%] bottom-[-10%]" />
        </div>
      </div>

      {!flipped && !adminView && (
        <div className="z-10 max-w-xl text-center mb-10">
          <h2 className="text-5xl font-bold text-pink-700 mb-4">Jasmine</h2>
          <p className="text-lg text-gray-700">
            Celebrating her 18th birthday in elegance and grace. Join us as we honor her transition into adulthood with an unforgettable night filled with love, laughter, and memories.
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
                    placeholder="Enter your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="mb-4 border border-pink-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                  {guestName}, you have responded: {rsvp === "attending" ? "Will Attend" : "Not Attending"}
                </p>
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
