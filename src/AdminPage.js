import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [responses, setResponses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const SPREADSHEET_ID = "1nxTF5sLo9Dmey-rdl6rk5hShjPOP66iAknrEp2k8nxQ";
  const GOOGLE_API_KEY = "AIzaSyDaCi6kZDq9HG1DHa_80tT9Wnzt5f1wC18";

  const fetchResponses = async () => {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Guest_Response?key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      if (!data.values || data.values.length <= 1) {
        setResponses([]);
        return;
      }
      // Skip header row and store all responses (name, response, timestamp)
      setResponses(data.values.slice(1));
    } catch (err) {
      console.error("Failed to fetch responses:", err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchResponses();
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (password === "admin123") {
      setAuthenticated(true);
    } else {
      alert("Wrong password.");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
    setResponses([]);
  };

  // Calculate totals
  const attendingCount = responses.filter(([, response]) => response === "attending").length;
  const notAttendingCount = responses.filter(([, response]) => response === "not attending").length;
  const totalCount = responses.length;

  // Format timestamp helper
  const formatTimestamp = (ts) => {
    if (!ts) return "-";
    const date = new Date(ts);
    if (isNaN(date)) return ts; // fallback to raw string
    return date.toLocaleString();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-pink-100">
        <motion.div className="p-6 max-w-sm w-full space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-pink-700">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-pink-300 rounded-md"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-pink-600 text-white py-2 rounded-md mt-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border border-pink-600 text-pink-600 py-2 rounded-md mt-2"
          >
            Back to RSVP
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-pink-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-pink-700">Guest Responses</h2>
        <button
          onClick={handleLogout}
          className="border border-pink-700 text-pink-700 px-4 py-1 rounded hover:bg-pink-100"
        >
          Logout
        </button>
      </div>

      {/* Totals */}
      <div className="max-w-3xl mx-auto mb-4 p-4 bg-white rounded-lg shadow">
        <p className="text-lg font-semibold text-pink-700">
          Attending: <span className="text-green-600">{attendingCount}</span> | Not Attending:{" "}
          <span className="text-red-600">{notAttendingCount}</span> | Total Responses: {totalCount}
        </p>
      </div>
      <div className="max-w-3xl mx-auto mb-4">
        <input
        type="text"
        placeholder="Search guest name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-pink-300 rounded-md"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto space-y-4">
        {responses.length === 0 ? (
          <p className="text-center text-gray-500">No responses yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-pink-100 text-pink-700 font-semibold">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Response</th>
                <th className="border px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {responses
              .filter(([name]) =>
                    name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(([name, response, timestamp], idx) => (
                <tr
                  key={idx}
                  className="hover:bg-pink-50"
                >
                  <td className="border px-4 py-2">{name}</td>
                  <td
                    className={`border px-4 py-2 ${
                      response === "attending" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {response}
                  </td>
                  <td className="border px-4 py-2">{formatTimestamp(timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
