import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

export default function App() {
  const [message, setMessage] = useState("");

  const sendSOS = () => {
    setMessage("SOS Alert Sent!");
    console.log("🚨 SOS Alert Sent! 🚨");
    alert("SOS Alert Sent!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <header className="bg-red-500 text-white py-4 px-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold">SOS Alert System</h1>
      </header>
      <button
        onClick={sendSOS}
        className="mt-10 px-6 py-3 bg-red-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
      >
        Send SOS 🚨
      </button>
      {message && <p className="mt-4 text-lg text-red-700">{message}</p>}
    </div>
  );
}


