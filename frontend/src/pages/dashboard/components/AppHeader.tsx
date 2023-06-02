import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '@/providers/auth/AuthProvider';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
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
            <Navbar.Brand href="/dashboard">Sistema Monitor Web</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/dashboard">Panel de control</Nav.Link>
              </Nav>
              <Nav>
                {isAuthenticated ?
                  <>
                    <NavDropdown title={currentUser.nombre} id="basic-nav-dropdown">
                      <NavDropdown.Item href="/configuracion">
                        Configuración
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => { logOut(), router.push('/') }}>
                        Cerrar sesión
                      </NavDropdown.Item>
                    </NavDropdown>
                  </> : <>
                    <Skeleton />
                  </>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
}
