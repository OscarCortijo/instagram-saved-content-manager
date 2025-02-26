import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos de autenticación desde localStorage al iniciar la aplicación
    const loadStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        
        if (storedUser && storedToken) {
          setCurrentUser(JSON.parse(storedUser));
          setAccessToken(storedToken);
        }
      } catch (error) {
        console.error('Error al cargar la información de autenticación:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStoredAuth();
  }, []);

  const login = ({ user, accessToken }) => {
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    
    // Actualizar estado
    setCurrentUser(user);
    setAccessToken(accessToken);
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    
    // Actualizar estado
    setCurrentUser(null);
    setAccessToken(null);
  };

  const value = {
    user: currentUser,
    accessToken,
    isAuthenticated: !!currentUser && !!accessToken,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
