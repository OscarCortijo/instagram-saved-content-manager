import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
              <svg className="h-8 w-8 text-pink-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" fill="currentColor" />
                <path d="M12 7.783c-2.327 0-4.217 1.89-4.217 4.217 0 2.327 1.89 4.217 4.217 4.217 2.327 0 4.217-1.89 4.217-4.217 0-2.327-1.89-4.217-4.217-4.217zm0 6.954c-1.512 0-2.737-1.225-2.737-2.737s1.225-2.737 2.737-2.737 2.737 1.225 2.737 2.737-1.225 2.737-2.737 2.737zM17.3 7.613c0 .544-.44.984-.984.984-.544 0-.984-.44-.984-.984 0-.544.44-.984.984-.984.544 0 .984.44.984.984z" fill="currentColor" />
              </svg>
              <span className="ml-2 font-bold text-xl text-gray-800">Content Manager</span>
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="hidden md:flex items-center">
              <Link to="/dashboard" className="px-3 py-2 text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link to="/saved-content" className="px-3 py-2 text-gray-700 hover:text-indigo-600">
                Contenido guardado
              </Link>
              <div className="ml-4 flex items-center">
                <span className="text-gray-700 mr-2">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : null}
          
          {/* Botón de menú móvil */}
          {isAuthenticated && (
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <svg className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Menú móvil */}
      {isAuthenticated && (
        <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/saved-content" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Contenido guardado
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-800">
                {user?.username}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
