// import React from 'react';
// import { NavLink } from 'react-router-dom';

// const Navbar = () => {
//   const navLinkStyle = ({ isActive }) =>
//     `relative px-4 py-2 text-sm font-medium transition ${
//       isActive
//         ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500'
//         : 'text-gray-300 hover:text-white'
//     }`;

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md px-8 py-4 shadow-md flex justify-between items-center">
//       <div className="text-white text-xl font-bold flex items-center gap-2">
//         <span className="text-blue-400 text-2xl">🚘</span>
//         Vehicle Sales BI
//       </div>
//       <div className="hidden md:flex space-x-6">
//         <NavLink to="/" className={navLinkStyle}>Home</NavLink>
//         <NavLink to="/dashboard" className={navLinkStyle}>Dashboard</NavLink>
//         <NavLink to="/decisions" className={navLinkStyle}>Decisions</NavLink>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-md transition font-medium ${
      isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-gray-200'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold flex items-center gap-2">
        🚘 Vehicle Sales BI
      </h1>
      <div className="space-x-2 hidden md:flex">
        <NavLink to="/" className={linkStyle}>Home</NavLink>
        <NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink>
        <NavLink to="/decisions" className={linkStyle}>Decisions</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
