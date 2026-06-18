import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Controlla se c'è un token salvato
    const isAuthorized = localStorage.getItem('token');

    // Se il token c'è, mostra il componente figlio (Outlet)
    // Se non c'è, reindirizza forzatamente alla pagina di login
    return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;