import React, { useEffect } from "react";
import { FaChartLine, FaMapMarkedAlt, FaCalendarAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const decisions = [
  {
    icon: <FaChartLine className="text-white text-3xl" />,
    title: "Concentrer les ressources sur les marques les plus performantes",
    content: `Le graphique "Top 5 marques les plus vendues" montre que Ford domine largement les ventes avec 1,3 milliard, suivie de Chevrolet et Nissan.
Il est donc pertinent de renforcer les actions commerciales (promotions, partenariats, approvisionnement) sur ces marques à forte demande pour maintenir ou accroître leur part de marché.`,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: <FaMapMarkedAlt className="text-white text-3xl" />,
    title: "Renforcer la présence dans les États les plus dynamiques",
    content: `Les visualisations par État révèlent que des régions comme Florida (FL), California (CA) et Pennsylvania (PA) réalisent les volumes de ventes les plus élevés.
Il est stratégique d’y concentrer les efforts logistiques et commerciaux, tout en analysant les États moins performants pour y adapter l’offre ou réduire les coûts.`,
    gradient: "from-green-500 to-green-700",
  },
  {
    icon: <FaCalendarAlt className="text-white text-3xl" />,
    title: "Cibler les jours et périodes les plus favorables aux ventes",
    content: `La répartition des ventes par jour de la semaine montre que les mardi, mercredi et jeudi sont les jours les plus actifs.
De plus, l’évolution mensuelle indique des pics clairs autour de février et juin.`,
    gradient: "from-purple-500 to-purple-700",
  },
];

const DecisionPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12" data-aos="fade-down">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Décisions Stratégiques
        </h1>
        <p className="text-gray-600 text-lg">
          Basé sur l’analyse des données Power BI, voici les recommandations
          stratégiques les plus impactantes.
        </p>
      </div>

      {/* Decision Cards */}
      {/* <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {decisions.map((decision, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`p-5 bg-gradient-to-r ${decision.gradient} flex items-center`}
            >
              <div className="mr-4">{decision.icon}</div>
              <h3 className="text-xl font-semibold text-white">
                {decision.title}
              </h3>
            </div>
            <div className="p-6 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {decision.content}
            </div>
          </div>
        ))}
      </div> */}
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {decisions.map((decision, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`p-5 bg-gradient-to-r ${decision.gradient} flex items-center`}
            >
              <div className="mr-4">{decision.icon}</div>
              <h3 className="text-xl font-semibold text-white">
                {decision.title}
              </h3>
            </div>
            <div className="p-6 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {decision.content}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="max-w-3xl mx-auto mt-16 text-center" data-aos="fade-up">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📥 Et ensuite ?
        </h2>
        <p className="text-gray-600 mb-6">
          Utilisez ces décisions pour ajuster vos actions commerciales et
          explorer davantage vos données sur le dashboard.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition"
        >
          Accéder au Dashboard
        </a>
      </div>
    </div>
  );
};

export default DecisionPage;
