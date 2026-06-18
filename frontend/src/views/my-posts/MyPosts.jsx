import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import BlogItem from "../../components/blog/blog-item/BlogItem"; 
import "./styles.css";

const MyPosts = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchMyPosts = async () => {
            if (!user) return;

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors/${user._id}/posts`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setMyPosts(data.posts || []);
                } else {
                    if (response.status === 404) {
                        setMyPosts([]);
                    } else {
                        setError(data.message || "Impossibile recuperare i tuoi post.");
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Errore di connessione al server.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [user]);

    if (loading) {
        return (
            <Container className="text-center pt-5 mt-5">
                <Spinner animation="border" variant="dark" />
            </Container>
        );
    }

    return (
        <Container fluid="sm" className="my-posts-container pt-5 mt-5">
            <h1 className="blog-main-title mb-5">I miei articoli</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            {myPosts.length === 0 ? (
                <Alert variant="info" className="text-center">
                    Non hai ancora pubblicato nessun articolo. Clicca su "Scrivi un post" per iniziare!
                </Alert>
            ) : (
                <Row>
                    {myPosts.map((post) => (
                        <Col key={post._id} md={4} style={{ marginBottom: 50 }}>
                            <BlogItem {...post} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyPosts;