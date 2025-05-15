import React from "react";

const ChartFilters = ({ filters, filterOptions, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {/* Année */}
      <select
        name="annee"
        value={filters.annee}
        onChange={onChange}
        className="p-2 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-100"
      >
        <option value="">Toutes les années</option>
        {filterOptions.annees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      {/* État */}
      <select
        name="state"
        value={filters.state}
        onChange={onChange}
        className="p-2 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-100"
      >
        <option value="">Tous les états</option>
        {filterOptions.states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Marque */}
      <select
        name="marque"
        value={filters.marque}
        onChange={onChange}
        className="p-2 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-100"
      >
        <option value="">Toutes les marques</option>
        {filterOptions.marques.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartFilters;
