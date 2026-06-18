import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import BlogItem from "../../components/blog/blog-item/BlogItem"
import "./styles.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        
        const token = localStorage.getItem("token"); 

        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts || []);
        } else {
          setError(data.message || "Errore durante il caricamento dei post.");
        }
      } catch (err) {
        console.error(err);
        setError("Impossibile connettersi al server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();

  }, []);
    console.log(posts)
  return (
    <Container fluid="sm" className="pt-5 mt-5">
      <h1 className="blog-main-title mb-5 text-center">Benvenuto sullo Strive Blog!</h1>

      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="success" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && posts.length === 0 && (
        <Alert variant="info" className="text-center">
          Nessun articolo presente nel blog. Sii il primo a scriverne uno!
        </Alert>
      )}

      <Row>
        {posts.map((post) => (
          <Col key={post._id} md={4} style={{ marginBottom: 50 }}>
            <BlogItem {...post} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;