import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./styles.css";

const Login = () => {
    const [loginForm, setLoginForm] = useState({})
    const { login } = useContext(AuthContext);

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target
        setLoginForm({
            ...loginForm,
            [name]: value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm)
            });

            const data = await response.json();

            if (response.ok) {
                await login(data.token);
                navigate("/");
            } else {
                setError("Credenziali errate");
            }
        } catch (e) {
            setError("Errore di connessione");
        }
    };

    return (
        <Container className="login-container pt-5 mt-5">
            <h1 className="blog-main-title mb-3 text-center mt-5">Accedi</h1>

            {error && (
                <Alert variant="danger" className="mt-4">
                    {error}
                </Alert>
            )}

            <Form className="mt-4" onSubmit={onSubmit}>
                <Form.Group controlId="login-email" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        size="lg"
                        type="email"
                        name="email"
                        placeholder="Inserisci la tua email"
                        onChange={onChangeInput}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="login-password" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="password"
                        name="password"
                        placeholder="Inserisci la tua password"
                        onChange={onChangeInput}
                        required
                    />
                </Form.Group>

                <Form.Group className="d-flex mt-4 justify-content-between align-items-center">
                    <Link to="/register" className="text-muted">
                        Non hai un account? Registrati
                    </Link>
                    <Button type="submit" size="lg" variant="dark">
                        Accedi
                    </Button>
                </Form.Group>
            </Form>

            <div className="position-relative text-center my-4">
                <hr className="w-100" />
                <span
                    className="text-muted position-absolute bg-white px-3"
                    style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }}
                >
                    Oppure
                </span>
            </div>

            <a
                href={process.env.REACT_APP_SERVER_BASE_URL + '/auth/google'}
                className="btn btn-outline-dark btn-lg w-100 d-flex justify-content-center align-items-center"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google Logo"
                    width="24"
                    height="24"
                    className="me-3"
                />
                Continua con Google
            </a>
        </Container>
    );
};

export default Login;
