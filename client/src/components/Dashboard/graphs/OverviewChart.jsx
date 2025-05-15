import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  FaCarSide,
  FaMoneyBillWave,
  FaBalanceScaleLeft,
  FaCoins,
} from "react-icons/fa";
import Spinner from "../../common/Spinner";
import ChartFilters from "../ChartFilters";

const OverviewChart = ({ filters, filterOptions, handleChange }) => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [topMarques, setTopMarques] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchStats = axios.get("http://localhost:4000/api/overview", {
      params: filters,
    });
    const fetchMonthly = axios.get(
      "http://localhost:4000/api/monthly-evolution",
      { params: filters }
    );
    const fetchTopMarques = axios.get("http://localhost:4000/api/top-marques", {
      params: filters,
    });

    Promise.all([fetchStats, fetchMonthly, fetchTopMarques])
      .then(([statsRes, monthlyRes, marquesRes]) => {
        setStats(statsRes.data);
        setMonthlySales(monthlyRes.data);
        setTopMarques(marquesRes.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      })
      .finally(() => setIsLoading(false));
  }, [filters]);


  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Résumé des Ventes
      </h3>

      {/* Filters */}
      <ChartFilters
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleChange}
      />

      {/* Loading or Stats */}
      {isLoading ? (
        <Spinner />
      ) : stats ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              icon={<FaCarSide className="text-3xl text-blue-600" />}
              label="Véhicules vendus"
              value={stats.total_ventes}
              bg="bg-blue-50"
            />
            <StatCard
              icon={<FaMoneyBillWave className="text-3xl text-green-600" />}
              label="Prix moyen"
              value={`${parseInt(stats.prix_moyen)} TND`}
              bg="bg-green-50"
            />
            <StatCard
              icon={<FaBalanceScaleLeft className="text-3xl text-yellow-600" />}
              label="Écart moyen (MMR)"
              value={`${parseInt(stats.ecart_moyen)} TND`}
              bg="bg-yellow-50"
            />
            <StatCard
              icon={<FaCoins className="text-3xl text-purple-600" />}
              label="Montant total des ventes"
              value={`${parseInt(stats.montant_total)} TND`}
              bg="bg-purple-50"
            />
          </div>

          {/* Charts Section */}
          <div className="flex flex-col xl:flex-row gap-10 overflow-x-auto">
            {/* Monthly Evolution Line Chart */}
            <div className="flex-1 min-w-[600px]">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                📅 Évolution mensuelle des ventes
              </h4>
              <LineChart width={600} height={300} data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="mois_annee"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis />
                <ReTooltip />
                <Line type="monotone" dataKey="total_ventes" stroke="#3b82f6" />
              </LineChart>
            </div>

            {/* Top Marques Bar Chart */}
            <div className="flex-1 min-w-[600px]">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                🏆 Top 5 marques les plus vendues
              </h4>
              <BarChart
                layout="vertical"
                width={600}
                height={300}
                data={topMarques}
                margin={{ left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="marque" />
                <ReTooltip />
                <Bar dataKey="total_ventes" fill="#10b981" />
              </BarChart>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Aucune donnée à afficher.</p>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }) => (
  <div className={`p-6 rounded-lg shadow-sm ${bg} flex items-center gap-4`}>
    <div className="shrink-0">{icon}</div>
    <div>
      <p className="text-xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default OverviewChart;
