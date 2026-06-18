import React, { useContext } from "react";
import { Button, Container, Navbar, NavDropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Importa il context
import logo from "../../assets/logo.png";
import "./styles.css";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext); // Prendi i dati globali
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="blog-navbar py-3" fixed="top" bg="white">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {user ? (
            <div className="d-flex align-items-center">
              <Button as={Link} to="/new" variant="outline-dark" className="me-4 rounded-pill">
                Scrivi un post
              </Button>

              {/* DROPDOWN PULITO */}
              <NavDropdown
                title={
                  <Image
                    src={user.avatar || "https://via.placeholder.com/40"}
                    roundedCircle
                    width="40"
                    height="40"
                    className="border"
                  />
                }
                id="collasible-nav-dropdown"
                align="end"
              >
                <NavDropdown.Header>Ciao, {user.firstName}!</NavDropdown.Header>
                <NavDropdown.Item as={Link} to="/my-posts">I miei post</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">Il mio profilo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">Impostazioni</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Esci
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          ) : (
            <div className="d-flex">
              <Button as={Link} to="/login" variant="link" className="text-dark text-decoration-none me-3">
                Accedi
              </Button>
              <Button as={Link} to="/register" variant="dark" className="rounded-pill">
                Registrati
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;