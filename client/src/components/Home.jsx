import React from 'react';
import Hero from '../assets/hero4.svg';
import { FaDatabase, FaProjectDiagram, FaChartBar } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-white via-blue-50 to-blue-100 py-24 px-6 flex flex-col-reverse md:flex-row items-center justify-between" data-aos="fade-down">
        <div className="max-w-xl mt-10 md:mt-0">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Optimisez la Vente de Véhicules avec la BI 🚗📊
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Explorez les tendances, améliorez vos performances et prenez des décisions stratégiques éclairées grâce à une visualisation intelligente des données.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Voir le Dashboard
          </a>
        </div>
        <img src={Hero} alt="BI Illustration" className="w-full max-w-md" />
      </header>

      {/* Features Section */}
      <section className="bg-white py-20 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">✨ Composants Clés du Système BI</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-gradient-to-tr from-blue-50 to-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-blue-600 text-4xl mb-4 flex justify-center"><FaDatabase /></div>
            <h3 className="text-lg font-semibold mb-2">Entrepôt de Données</h3>
            <p className="text-gray-600 text-sm">Architecture en étoile pour structurer efficacement les données de vente et améliorer les performances analytiques.</p>
          </div>
          <div className="bg-gradient-to-tr from-green-50 to-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-green-600 text-4xl mb-4 flex justify-center"><FaProjectDiagram /></div>
            <h3 className="text-lg font-semibold mb-2">ETL Automatisé</h3>
            <p className="text-gray-600 text-sm">Pipeline Talend pour extraire, transformer et charger des données depuis diverses sources en continu.</p>
          </div>
          <div className="bg-gradient-to-tr from-purple-50 to-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-purple-600 text-4xl mb-4 flex justify-center"><FaChartBar /></div>
            <h3 className="text-lg font-semibold mb-2">Dashboard Web</h3>
            <p className="text-gray-600 text-sm">Interface intuitive basée sur React + Power BI pour des visualisations interactives et précises.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center mt-auto">
        <p className="text-sm">
          © 2025 Vehicle BI | Projet universitaire. Illustrations par <a href="https://undraw.co" className="underline hover:text-white">unDraw</a>.
        </p>
      </footer>
    </div>
  );
};

export default Home;
