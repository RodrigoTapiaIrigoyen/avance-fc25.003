import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaGamepad, FaTrophy, FaWallet, FaMoneyBillWave } from 'react-icons/fa';
import clsx from 'clsx';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
        isActive 
          ? 'text-white bg-game-accent bg-opacity-20'
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
      )}
    >
      {children}
    </Link>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-game-primary">
      <nav className="bg-game-secondary/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-gradient">
                SuperEvilMegacorpGaming
              </Link>
              <div className="hidden md:flex md:items-center md:space-x-2">
                <NavLink to="/dashboard">
                  <FaHome className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/1vs1">
                  <FaGamepad className="h-4 w-4" />
                  <span>1v1</span>
                </NavLink>
                <NavLink to="/torneos">
                  <FaTrophy className="h-4 w-4" />
                  <span>Tournaments</span>
                </NavLink>
                <NavLink to="/depositos">
                  <FaWallet className="h-4 w-4" />
                  <span>Deposit</span>
                </NavLink>
                <NavLink to="/retiros">
                  <FaMoneyBillWave className="h-4 w-4" />
                  <span>Withdraw</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;