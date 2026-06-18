import React, { useCallback, useState, useContext } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import { useNavigate } from "react-router-dom";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import { AuthContext } from "../../context/AuthContext"; 
import "./styles.css";

const NewBlogPost = props => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Categoria 1");
  const [text, setText] = useState("");
  const [coverFile, setCoverFile] = useState(null);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = useCallback(value => {
    setText(draftToHtml(value));
  }, []);

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
  
      const token = localStorage.getItem("token");
      const postData = {
        title: title,
        category: category,
        content: text,
        author: user._id 
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (response.ok) {
        const newPostId = data.post ? data.post._id : data.posts._id; 

        if (coverFile && newPostId) {
          const formData = new FormData();
          formData.append("cover", coverFile);

          await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${newPostId}/cover`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: formData
          });
        }


        navigate("/");
      } else {
        setError(data.message || "Errore durante la creazione del post.");
      }
    } catch (e) {
      console.error(e);
      setError("Errore di connessione.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="new-blog-container pt-5 mt-5">
      <h1 className="blog-main-title mb-3">Scrivi un nuovo articolo</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="mt-5" onSubmit={onSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Inserisci il titolo" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control 
            size="lg" 
            as="select" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Tech</option>
            <option>Lifestyle</option>
            <option>Coding</option>
            <option>News</option>
          </Form.Control>
        </Form.Group>


        <Form.Group controlId="blog-cover" className="mt-4">
          <Form.Label>Immagine di Copertina</Form.Label>
          <Form.Control 
            type="file" 
            size="lg" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-4">
          <Form.Label>Contenuto Blog</Form.Label>
          <Editor onChange={handleChange} className="new-blog-content" />
        </Form.Group>

        <Form.Group className="d-flex mt-4 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            disabled={isLoading}
            style={{ marginLeft: "1em" }}
          >
            {isLoading ? "Invio in corso..." : "Pubblica Articolo"}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;