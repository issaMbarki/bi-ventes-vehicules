import React from "react";
import {
  FaChartPie,
  FaClock,
  FaCar,
  FaMapMarkedAlt,
  FaUserTie,
} from "react-icons/fa";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: <FaChartPie /> },
    { id: "temps", label: "Temps", icon: <FaClock /> },
    { id: "marque", label: "Marques", icon: <FaCar /> },
    { id: "state", label: "États", icon: <FaMapMarkedAlt /> },
    { id: "vendeurs", label: "Vendeurs", icon: <FaUserTie /> },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200
            ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
