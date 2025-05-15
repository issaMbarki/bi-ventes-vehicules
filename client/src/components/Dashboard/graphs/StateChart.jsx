import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import Spinner from "../../common/Spinner";
import ChartFilters from "../ChartFilters";

const StateChart = ({ filters, filterOptions, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ventesParState, setVentesParState] = useState([]);
  const [prixParState, setPrixParState] = useState([]);
  const [rankingStates, setRankingStates] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("http://localhost:4000/api/state/ventes-par-state", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/state/prix-moyen-par-state", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/state/ranking", { params: filters }),
    ])
      .then(([vps, pps, rank]) => {
        setVentesParState(vps.data);
        setPrixParState(pps.data);
        setRankingStates(rank.data);
      })
      .finally(() => setIsLoading(false));
  }, [filters]);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        🗺️ Analyse par État
      </h3>

      {/* Filters */}
      <ChartFilters
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleChange}
      />

      {/* Charts */}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-14">
          {/* Ventes par état */}
          <div className="overflow-auto">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              📊 Nombre de ventes par État
            </h4>
            <BarChart width={1600} height={300} data={ventesParState}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" angle={-45} interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventes" fill="#6366f1" />
            </BarChart>
          </div>

          {/* Prix moyen par état */}
          <div className="overflow-auto">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              💰 Prix moyen par État
            </h4>
            <LineChart width={1000} height={300} data={prixParState}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" angle={-45} interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="prix_moyen" stroke="#10b981" />
            </LineChart>
          </div>

          {/* Top États */}
          <div className="overflow-auto">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              🏆 Top États par volume de ventes
            </h4>
            <BarChart
              layout="vertical"
              width={600}
              height={300}
              data={rankingStates}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="state" interval={0} />
              <Tooltip />
              <Bar dataKey="ventes" fill="#f59e0b" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateChart;
