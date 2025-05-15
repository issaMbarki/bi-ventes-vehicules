import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Spinner from "../../common/Spinner";
import ChartFilters from "../ChartFilters";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#0ea5e9",
];

const VendeursChart = ({ filters, filterOptions, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chiffreAffaire, setChiffreAffaire] = useState([]);
  const [prixMoyen, setPrixMoyen] = useState([]);
  const [topVendeurs, setTopVendeurs] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("http://localhost:4000/api/seller/classement-chiffre-affaire", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/seller/prix-moyen", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/seller/top-volume", {
        params: filters,
      }),
    ])
      .then(([ca, pm, tv]) => {
        setChiffreAffaire(ca.data);
        setPrixMoyen(pm.data);
        setTopVendeurs(tv.data);
      })
      .finally(() => setIsLoading(false));
  }, [filters]);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        🧑‍💼 Analyse par Vendeur
      </h3>

      {/* Filters */}
      <ChartFilters
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleChange}
      />

      {/* Charts Section */}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-14">
          {/* Top vendeurs - Pie */}
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-lg font-semibold mb-6 text-gray-700">
              🥇 Top vendeurs par volume de ventes
            </h4>
            <PieChart width={500} height={400}>
              <Pie
                data={topVendeurs}
                dataKey="ventes"
                nameKey="vendeur"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {topVendeurs.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Chiffre d'affaire */}
          <div className="overflow-auto flex justify-center self-center">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              💼 Classement par chiffre d'affaires
            </h4>
            <BarChart width={1200} height={300} data={chiffreAffaire}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendeur" angle={-45} interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="chiffre_affaire" fill="#3b82f6" />
            </BarChart>
          </div>

          {/* Prix moyen */}
          <div className="overflow-auto  flex justify-center">
            <h4 className="text-lg font-semibold mb-4 text-gray-700 self-center">
              💰 Prix moyen par vendeur
            </h4>
            <BarChart width={1200} height={300} data={prixMoyen}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendeur" angle={-45} interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="prix_moyen" fill="#10b981" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendeursChart;
