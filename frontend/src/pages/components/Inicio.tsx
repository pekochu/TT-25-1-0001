import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Inicio() {
    return (
        <>
            <main role="main" className="container mt-5">
                <Container>
                    <div className="px-4 py-5 my-5 text-center">
                        <h1 className="display-5 fw-bold text-body-emphasis">Sistema Monitor Web</h1>
                        <div className="col-lg-6 mx-auto">
                            <p className="lead mb-4">Monitoreamos páginas web para que tú no tengas que hacerlo.</p>
                            {/*<div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                            <button type="button" className="btn btn-primary btn-lg px-4 gap-3">Primary button</button>
                            <button type="button" className="btn btn-outline-secondary btn-lg px-4">Secondary</button>
                        </div>
                        */}
                        </div>
                    </div>
                </Container>
                <div className="divider" />
                <Container>
                    <div className="px-4 py-5 my-5 text-center">
                        <div className="col-lg-6 mx-auto">
                            <Form.Label htmlFor="basic-url">Introduce una URL</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon3">
                                    https://ejemplo.com/
                                </InputGroup.Text>
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                            </InputGroup>
                        </div>
                    </div>
                </Container>
            </main>
        </>
    );
}
