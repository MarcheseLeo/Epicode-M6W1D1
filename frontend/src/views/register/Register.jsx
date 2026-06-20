import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

const Register = () => {
    const [registerForm, setRegisterForm] = useState({})

    const [error, setError] = useState(null);


    const navigate = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target
        setRegisterForm({
            ...registerForm,
            [name]: value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerForm)
            });

            const data = await response.json();

            if (response.ok) {

                navigate('/login');
            } else {
                console.error("Errore dal server:", data);

                if (data.errors && data.errors.length > 0) {
                    const errorMessages = data.errors.map(err => err.msg).join(" - ");
                    setError(errorMessages);
                }

                else {
                    setError(data.message || "Errore durante la registrazione. Controlla i dati.");
                }
            }
        } catch (e) {
            console.error(e);
            setError("Impossibile connettersi al server. Riprova più tardi.");
        }
    };
    return (
        <Container className="register-container pt-5 mt-5">
            <h1 className="blog-main-title mb-3 text-center mt-5">Crea un Account</h1>

            {error && (
                <Alert variant="danger" className="mt-4 text-center">
                    {error}
                </Alert>
            )}
            <Form className="mt-5" onSubmit={onSubmit}>
                <div className="d-flex gap-3">
                    <Form.Group controlId="register-nome" className="mt-3 w-50">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            size="lg"
                            type="text"
                            name="firstName"
                            placeholder="Il tuo nome"
                            onChange={onChangeInput}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="register-cognome" className="mt-3 w-50">
                        <Form.Label>Cognome</Form.Label>
                        <Form.Control
                            size="lg"
                            type="text"
                            placeholder="Il tuo cognome"
                            name="lastName"
                            onChange={onChangeInput}
                            required
                        />
                    </Form.Group>
                </div>

                <Form.Group controlId="register-email" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        size="lg"
                        type="email"
                        placeholder="Inserisci un indirizzo email"
                        name="email"
                        onChange={onChangeInput}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="register-password" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="password"
                        placeholder="Scegli una password sicura"
                        name="password"
                        onChange={onChangeInput}
                        required
                    />
                </Form.Group>

                <Form.Group className="d-flex mt-4 justify-content-between align-items-center">
                    <Link to="/login" className="text-muted">
                        Hai già un account? Accedi
                    </Link>
                    <Button type="submit" size="lg" variant="dark">
                        Registrati
                    </Button>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default Register;
