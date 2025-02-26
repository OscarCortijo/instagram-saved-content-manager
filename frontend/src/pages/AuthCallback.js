import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuthCallback = () => {
  const [status, setStatus] = useState('Procesando autenticación...');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Obtener el código de autorización de los parámetros de la URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          throw new Error('No se recibió un código de autorización válido.');
        }

        setStatus('Intercambiando código por token...');
        
        // Enviar código al backend para obtener el token
        const response = await axios.get(`http://localhost:3001/api/auth/instagram/callback?code=${code}`);
        
        if (!response.data.success) {
          throw new Error('Error al obtener el token de acceso.');
        }

        setStatus('Autenticación exitosa. Redirigiendo...');
        
        // Guardar información de autenticación
        login({
          user: response.data.user,
          accessToken: response.data.access_token
        });
        
        // Redireccionar al dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        
      } catch (error) {
        console.error('Error en el proceso de autenticación:', error);
        setStatus('Error en la autenticación');
        setError(error.message || 'Error desconocido en el proceso de autenticación.');
      }
    };

    processAuth();
  }, [location, navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6">Autenticación de Instagram</h2>
        
        <div className="mb-6">
          {error ? (
            <div className="text-red-500">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-700">{status}</p>
            </div>
          )}
        </div>
        
        {error && (
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
