import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '@/providers/auth/AuthProvider';

export default function Header() {
  const {
    currentUser,
    logOut,
    refreshSession,
    isAuthenticated,
    accessToken,
    refreshToken,
  } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <header>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">ESCOMONITOR</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Inicio</Nav.Link>
                <Nav.Link href="/contacto">Contacto</Nav.Link>
                <Nav.Link href="/about">Acerca de</Nav.Link>
                {/* <NavDropdown title="Ejemplo de Menú" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Opción 1</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Opción 2</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Opción 3</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="contacto">
                    Opción separada
                  </NavDropdown.Item> 
                </NavDropdown>
                */}
              </Nav>
              <Nav>
                <Nav.Link href="/login">Iniciar sesión</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
}
