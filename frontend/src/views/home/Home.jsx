import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Form, Button, InputGroup } from "react-bootstrap";
import BlogItem from "../../components/blog/blog-item/BlogItem";
import "./styles.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [searchQuery, setSearchQuery] = useState("");


  const fetchPosts = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      let url = `${process.env.REACT_APP_SERVER_BASE_URL}/posts`;


      if (query.trim() !== "") {
        url = `${process.env.REACT_APP_SERVER_BASE_URL}/posts/search?title=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
      } else {

        if (response.status === 404) {
          setPosts([]);
        } else {
          setError(data.message || "Errore durante il caricamento dei post.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Impossibile connettersi al server.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts(searchQuery);
  };


  const handleResetSearch = () => {
    setSearchQuery("");
    fetchPosts("");
  };

  return (
    <Container fluid="sm" className="pt-5 mt-5">
      <h1 className="blog-main-title mb-4 text-center">Benvenuto sullo Strive Blog!</h1>


      <Form onSubmit={handleSearchSubmit} className="mb-5 d-flex justify-content-center">
        <InputGroup style={{ maxWidth: '600px' }}>
          <Form.Control
            size="lg"
            placeholder="Cerca un articolo per titolo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="dark">
            Cerca
          </Button>
          {searchQuery && (
            <Button variant="outline-danger" onClick={handleResetSearch}>
              Reset
            </Button>
          )}
        </InputGroup>
      </Form>


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
          {searchQuery ? "Nessun articolo trovato per questa ricerca." : "Nessun articolo presente nel blog. Sii il primo a scriverne uno!"}
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