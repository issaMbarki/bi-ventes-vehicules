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
import ChartFilters from "../ChartFilters";
import Spinner from "../../common/Spinner";

const TempsChart = ({ filters, filterOptions, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [daySales, setDaySales] = useState([]);
  const [yearSales, setYearSales] = useState([]);
  const [avgPriceByMonth, setAvgPriceByMonth] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("http://localhost:4000/api/temps/day-of-week", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/temps/by-year", {
        params: filters,
      }),
      axios.get("http://localhost:4000/api/temps/avg-price-by-month", {
        params: filters,
      }),
    ])
      .then(([dayRes, yearRes, priceRes]) => {
        setDaySales(dayRes.data);
        setYearSales(yearRes.data);
        setAvgPriceByMonth(priceRes.data);
      })
      .finally(() => setIsLoading(false));
  }, [filters]);

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        ⏱️ Analyse Temporelle des Ventes
      </h3>

      {/* Filters */}
      <ChartFilters
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleChange}
      />

      {/* Loading or Charts */}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-14">
          {/* Day of Week + Monthly Price Charts */}
          <div className="flex flex-col xl:flex-row gap-10 overflow-x-auto justify-around">
            {/* Bar Chart - Ventes par jour */}
            <div className="min-w-[600px]">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">
                📅 Ventes par jour de la semaine
              </h4>
              <BarChart
                layout="vertical"
                width={600}
                height={300}
                data={daySales}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="jour" />
                <Tooltip />
                <Bar dataKey="ventes" fill="#6366f1" />
              </BarChart>
            </div>

            {/* Bar Chart - Prix par mois */}
            <div className="min-w-[600px]">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">
                💰 Prix moyen par mois
              </h4>
              <BarChart width={600} height={300} data={avgPriceByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="prix_moyen" fill="#f59e0b" />
              </BarChart>
            </div>
          </div>

          {/* Line Chart - Ventes par année */}
          <div className="flex justify-center overflow-x-auto">
            <div className="min-w-[600px]">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">
                📈 Ventes par année
              </h4>
              <LineChart width={600} height={300} data={yearSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ventes" stroke="#10b981" />
              </LineChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempsChart;
