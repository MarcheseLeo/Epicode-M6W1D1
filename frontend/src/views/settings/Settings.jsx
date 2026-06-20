import React from "react";
import { Container, Alert } from "react-bootstrap";

const Settings = () => {
    return (
        <Container className="pt-5 mt-5">
            <h1 className="blog-main-title mb-4">Impostazioni</h1>
            <Alert variant="info">
                Questa sezione e pronta per le preferenze dell'account.
            </Alert>
        </Container>
    );
};

export default Settings;
