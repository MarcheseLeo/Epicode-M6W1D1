import React, { useEffect, useState, useContext } from "react";
import { Container, Image, Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from 'react-draft-wysiwyg';
import { AuthContext } from "../../context/AuthContext";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import draftToHtml from "draftjs-to-html";
import "./styles.css";

const Blog = () => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editContent, setEditContent] = useState("");
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentRate, setNewCommentRate] = useState(5);

  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchPostDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${params.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setBlog(data.post);
        setEditTitle(data.post.title);
        setEditCategory(data.post.category);
        setEditContent(data.post.content);
      } else {
        setStatus({ type: "danger", message: data.message || "Post non trovato" });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "danger", message: "Errore nel caricamento del post." });
    } finally {
      setLoading(false);
    }
  };


  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${params.id}/comments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {

        setComments(data.comments || data || []); 
      }
    } catch (error) {
      console.error("Errore nel caricamento dei commenti:", error);
    }
  };

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [params.id]);


  const handleDeletePost = async () => {

    const confirmDelete = window.confirm("Sei sicuro di voler eliminare definitivamente questo articolo?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${blog._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {

        navigate("/my-posts");
      } else {
        setStatus({ type: "danger", message: "Impossibile eliminare l'articolo." });
      }
    } catch (e) {
      console.error(e);
      setStatus({ type: "danger", message: "Errore di connessione." });
    }
  };


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const commentData = {
        comment: newCommentText,
        rate: newCommentRate
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${blog._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        setNewCommentText(""); 
        fetchComments(); 
        setStatus({ type: "success", message: "Commento aggiunto con successo!" });
      } else {
        setStatus({ type: "danger", message: "Errore nell'invio del commento." });
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleSaveChanges = async (e) => {

    e.preventDefault();
    setStatus({ type: "info", message: "Salvataggio in corso..." });

    try {
      const token = localStorage.getItem("token");
      const updatedData = { title: editTitle, category: editCategory, content: editContent };

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${blog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        if (newCoverFile) {
          const formData = new FormData();
          formData.append("cover", newCoverFile);
          await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${blog._id}/cover`, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
          });
        }
        setStatus({ type: "success", message: "Articolo modificato con successo!" });
        setIsEditing(false);
        setNewCoverFile(null);
        fetchPostDetails();
      } else {
        setStatus({ type: "danger", message: "Errore nel salvataggio." });
      }
    } catch (err) {
      setStatus({ type: "danger", message: "Errore di connessione." });
    }
  };

  if (loading) return <Container className="text-center pt-5 mt-5"><Spinner animation="border" /></Container>;

  const isAuthor = user && blog.author && user._id === blog.author._id;

  return (
    <div className="blog-details-root">
      <Container>
        {status.message && <Alert variant={status.type} className="mt-3">{status.message}</Alert>}


        {isAuthor && (
          <div className="d-flex justify-content-end mb-3" style={{ gap: "10px" }}>

            <Button variant="outline-danger" onClick={handleDeletePost}>
              Elimina Articolo
            </Button>
            <Button 
              variant={isEditing ? "outline-secondary" : "dark"} 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Annulla Modifica" : "Modifica Articolo"}
            </Button>
          </div>
        )}

        {isEditing ? (

          <Form onSubmit={handleSaveChanges} className="mt-4 bg-light p-4 rounded shadow-sm">
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Titolo Articolo</Form.Label>
              <Form.Control 
                size="lg" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Categoria</Form.Label>
              <Form.Control 
                size="lg" 
                value={editCategory} 
                onChange={(e) => setEditCategory(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Testo dell'Articolo</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={8} 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Nuova Copertina (Opzionale)</Form.Label>
              <Form.Control 
                type="file" 
                size="lg"
                onChange={(e) => setNewCoverFile(e.target.files[0])} 
              />
              <Form.Text className="text-muted">
                Seleziona un'immagine solo se vuoi sostituire quella attuale.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="success" size="lg">
                Salva Modifiche
              </Button>
            </div>
          </Form>
        ) : (

          <>
            <Image className="blog-details-cover" src={blog.cover} fluid />
            <h1 className="blog-details-title">{blog.title}</h1>

            <div className="blog-details-container mb-4">
              <div className="blog-details-author">
                <BlogAuthor {...blog.author} />
              </div>
              <div className="blog-details-info">
                <div>{new Date(blog.createdAt).toLocaleDateString()}</div>
                <div>{`Categoria: ${blog.category}`}</div>
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>


            <div className="mt-5 pt-4 border-top">
              <h3 className="mb-4">Commenti ({comments.length})</h3>

              {/* Form per Nuovo Commento */}
              <Form onSubmit={handleCommentSubmit} className="mb-5 bg-light p-4 rounded shadow-sm">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Lascia un commento</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Cosa ne pensi di questo articolo?"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3 d-flex align-items-center" style={{gap: '15px'}}>
                  <Form.Label className="fw-bold mb-0">Voto:</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={newCommentRate} 
                    onChange={(e) => setNewCommentRate(e.target.value)}
                    style={{ width: '80px' }}
                  >
                    {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
                  </Form.Control>
                  <Button type="submit" variant="dark" className="ms-auto">Pubblica</Button>
                </Form.Group>
              </Form>


              {comments.length === 0 ? (
                <p className="text-muted text-center">Nessun commento ancora. Rompi il ghiaccio!</p>
              ) : (
                comments.map((c, index) => (
                  <Card key={index} className="mb-3 border-0 shadow-sm">
                    <Card.Body>

                      <Card.Title className="fs-6 d-flex justify-content-between">
                         Utente 
                         <span className="text-warning">★ {c.rate}/5</span>
                      </Card.Title>
                      <Card.Text>{c.comment}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>

          </>
        )}
      </Container>
    </div>
  );
};

export default Blog;