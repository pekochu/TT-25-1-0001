import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Header() {
    return (
        <>
            <header>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">Sistema Monitor Web</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#home">Inicio</Nav.Link>
                                <Nav.Link href="#link">Contacto</Nav.Link>
                                <NavDropdown title="Ejemplo de Menú" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.1">Opción 1</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Opción 2</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Opción 3</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="contacto">
                                        Opción separada
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
}
