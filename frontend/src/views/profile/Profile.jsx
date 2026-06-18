import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert, Image } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import "./styles.css";

const Profile = () => {

    const { user, login } = useContext(AuthContext); 
    
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState({ type: "", message: "" });


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            setPreview(URL.createObjectURL(selectedFile)); 
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setStatus({ type: "danger", message: "Seleziona prima un'immagine!" });
            return;
        }

        const formData = new FormData();

        formData.append("avatar", file); 

        try {
            setStatus({ type: "info", message: "Caricamento in corso..." });

            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors/${user._id}/avatar`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`

                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: "success", message: "Avatar aggiornato con successo!" });

                if(login) login(token); 
                
            } else {
                setStatus({ type: "danger", message: data.message || "Errore durante il caricamento" });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: "danger", message: "Errore di connessione" });
        }
    };

    if (!user) return <Container className="pt-5 mt-5">Caricamento...</Container>;

    return (
        <Container className="profile-container pt-5 mt-5 text-center">
            <h1 className="blog-main-title mb-4">Modifica Profilo</h1>

            {status.message && (
                <Alert variant={status.type} className="mb-4">
                    {status.message}
                </Alert>
            )}

            <Form onSubmit={handleUpload} className="d-flex flex-column align-items-center">
                
                <div className="avatar-preview-container mb-4">
                    <Image 
                        src={preview || user.avatar || "https://via.placeholder.com/150"} 
                        roundedCircle 
                        className="avatar-preview shadow-sm"
                    />
                </div>

                <Form.Group className="mb-4">
                    <Form.Control 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg" 
                        onChange={handleFileChange}
                    />
                </Form.Group>

                <Button type="submit" variant="dark" size="lg" disabled={!file}>
                    Salva Avatar
                </Button>
            </Form>
        </Container>
    );
};

export default Profile;