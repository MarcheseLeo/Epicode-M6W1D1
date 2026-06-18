import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';

export const OauthSuccessPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const handleLogin = async () => {
            if (token) {
                await login(token);
                navigate('/');
            } else {
                navigate('/login');
            }
        };

        const timer = setTimeout(() => {
            handleLogin();
        }, 2000);

        return () => clearTimeout(timer);
    }, [token, navigate, login]);

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center pt-5 mt-5" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" style={{ color: '#00d66f', width: '4rem', height: '4rem' }} />
            <h2 className="mt-4 fw-bold" style={{ color: '#00d66f' }}>Autenticazione in corso...</h2>
            <p className="text-muted">Stiamo preparando il tuo account. Verrai reindirizzato a breve.</p>
        </Container>
    );
}