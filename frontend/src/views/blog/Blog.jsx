import React, { useEffect, useState, useContext } from "react";
import { Container, Image, Button, Form, Alert, Spinner } from "react-bootstrap";
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

  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchPostDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${params.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
  useEffect(() => {
    fetchPostDetails();
  }, [params.id]);


  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", message: "Salvataggio in corso..." });

    try {
      const token = localStorage.getItem("token");


      const updatedData = {
        title: editTitle,
        category: editCategory,
        content: editContent
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${blog._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
        const errData = await response.json();
        setStatus({ type: "danger", message: errData.message || "Errore nel salvataggio." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "danger", message: "Errore di connessione." });
    }
  };

  if (loading) return <Container className="text-center pt-5 mt-5"><Spinner animation="border" /></Container>;


  const isAuthor = user && blog.author && user._id === blog.author._id;

  return (
    <div className="blog-details-root mt-5 pt-5">
      <Container>
        {status.message && <Alert variant={status.type}>{status.message}</Alert>}


        {isEditing ? (

          <Form onSubmit={handleSaveChanges} className="mt-4">
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
                as="select"
                size="lg"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                <option>Tech</option>
                <option>Lifestyle</option>
                <option>Coding</option>
                <option>News</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nuova Immagine di Copertina (Opzionale)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewCoverFile(e.target.files[0])}
              />
              <Form.Text className="text-muted">Se non selezioni un file, rimarrà la vecchia copertina.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Contenuto</Form.Label>

              <Editor
                defaultContentState={undefined}
                onChange={(value) => setEditContent(draftToHtml(value))}
              />
            </Form.Group>

            <Button type="submit" variant="success" size="lg">Salva Modifiche</Button>
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
                <div style={{ marginTop: 20 }}>
                  <BlogLike defaultLikes={["123"]} onChange={console.log} />
                </div>
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          </>
        )}

        {isAuthor && (
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant={isEditing ? "outline-secondary" : "dark"}
              onClick={() => {
                setIsEditing(!isEditing);
                setStatus({ type: "", message: "" });
              }}
            >
              {isEditing ? "Annulla Modifica" : "Modifica Articolo"}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Blog;