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

const MarqueChart = ({ filters, filterOptions, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [avgPrice, setAvgPrice] = useState([]);
  const [topModels, setTopModels] = useState([]);
  const [ecarts, setEcarts] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("http://localhost:4000/api/marque/avg-price-by-make", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/marque/top-models", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/marque/ecart-par-modele", {
        params: filters,
      }),
    ])
      .then(([priceRes, modelRes, ecartRes]) => {
        setAvgPrice(priceRes.data);
        setTopModels(modelRes.data);
        setEcarts(ecartRes.data);
      })
      .finally(() => setIsLoading(false));
  }, [filters]);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        🚘 Analyse par Marque
      </h3>

      {/* Filters */}
      <ChartFilters
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleChange}
      />

      {/* Content */}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-14">
          {/* Chart: Prix moyen par marque */}
          <div className="overflow-auto">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              💵 Prix moyen par marque
            </h4>
            <BarChart width={1600} height={300} data={avgPrice}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="marque"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="prix_moyen" fill="#6366f1" />
            </BarChart>
          </div>

          {/* Chart row: Top modèles + Écart */}
          <div className="flex flex-col xl:flex-row gap-10 overflow-x-auto justify-around">
            {/* Chart: Top modèles */}
            <div className="min-w-[600px]">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">
                🏆 Top 10 modèles vendus
              </h4>
              <BarChart
                layout="vertical"
                width={600}
                height={300}
                data={topModels}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="marque_modele" />
                <Tooltip />
                <Bar dataKey="ventes" fill="#10b981" />
              </BarChart>
            </div>

            {/* Chart: Écart moyen par modèle */}
            <div className="min-w-[600px]">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">
                📉 Écart moyen entre prix & MMR (par modèle)
              </h4>
              <LineChart width={600} height={300} data={ecarts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="modele"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ecart" stroke="#f59e0b" />
              </LineChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarqueChart;
