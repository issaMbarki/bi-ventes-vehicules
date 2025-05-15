import React, { useState, useEffect } from 'react';
import Tabs from './Tabs';
import OverviewChart from './graphs/OverviewChart';
import TempsChart from './graphs/TempsChart';
import MarqueChart from './graphs/MarqueChart';
import StateChart from './graphs/StateChart';
import VendeursChart from './graphs/VendeursChart';
import axios from 'axios';
import Spinner from '../common/Spinner';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [filters, setFilters] = useState({ annee: "", state: "", marque: "" });
  const [filterOptions, setFilterOptions] = useState({
    annees: [],
    states: [],
    marques: [],
  });
  const [filtersLoading, setFiltersLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/filters")
      .then((res) => setFilterOptions(res.data))
      .finally(() => setFiltersLoading(false));
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const chartProps = {
    filters,
    filterOptions,
    handleChange,
  };

  const renderChart = () => {
    switch (activeTab) {
      case "overview": return <OverviewChart {...chartProps} />;
      case "temps": return <TempsChart {...chartProps} />;
      case "marque": return <MarqueChart {...chartProps} />;
      case "state": return <StateChart {...chartProps} />;
      case "vendeurs": return <VendeursChart {...chartProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">📊 Tableau de Bord</h2>
        <p className="text-gray-500 mt-2">Filtrez et visualisez les données selon vos critères.</p>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full">
        {filtersLoading ? <Spinner /> : renderChart()}
      </div>
    </div>
  );
};

export default Dashboard;
