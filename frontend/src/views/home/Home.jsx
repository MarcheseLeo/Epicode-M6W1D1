import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Form, Button, InputGroup } from "react-bootstrap";
import BlogItem from "../../components/blog/blog-item/BlogItem";
import "./styles.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [searchQuery, setSearchQuery] = useState("");


  const fetchPosts = async (query = "", page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      let url = `${process.env.REACT_APP_SERVER_BASE_URL}/posts?page=${page}`;


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
        setCurrentPage(Number(data.page) || page);
        setTotalPages(Number(data.totalPages) || 1);
      } else {

        if (response.status === 404) {
          setPosts([]);
          setCurrentPage(1);
          setTotalPages(1);
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
    fetchPosts(searchQuery, 1);
  };


  const handleResetSearch = () => {
    setSearchQuery("");
    fetchPosts("", 1);
  };

  const handlePageChange = (page) => {
    fetchPosts(searchQuery, page);
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

      {!loading && !error && !searchQuery && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mb-5">
          <Button
            variant="outline-dark"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Precedente
          </Button>
          <span>Pagina {currentPage} di {totalPages}</span>
          <Button
            variant="outline-dark"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Successiva
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
