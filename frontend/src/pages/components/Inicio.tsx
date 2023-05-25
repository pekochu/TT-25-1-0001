import 'react-image-crop/dist/ReactCrop.css'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useId, useState } from 'react';
import ReactCrop from 'react-image-crop'

export default function Inicio() {

  const urlId = useId();
  const urlGroupId = useId();
  const imgId = useId();
  const nombreId = useId();
  const nombreGroupId = useId();
  const apellidoId = useId();
  const apellidoGroupId = useId();
  const emailId = useId();
  const emailGroupId = useId();
  const frecuenciaId = useId();
  const frecuenciaGroupId = useId();
  const descripcionId = useId();
  const descripcionGroupId = useId();
  const diferenciaId = useId();
  const diferenciaGroupId = useId();

  const [validated, setValidated] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [img, setImg] = useState('https://www.tutorials24x7.com/uploads/2020-05-23/files/1-tutorials24x7-chrome-full-page-screen-capture-page.png');

  const getSnapshot = async () => {
    const res = await fetch('http://localhost:3000/api/v1/screenshot', { credentials: 'include', });
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
    setScreenshotLoading(false);
  };

  const requestSnapshot = async (event: any) => {
    event.preventDefault();
    // Obtenemos el formulario
    const form = event.target;
    const urlParams = new URLSearchParams({ url: form.url.value });
    setScreenshotLoading(true);
    // Solicitamos el screenshot del navegador
    const result = await fetch('http://localhost:3000/api/v1/goto?' + urlParams.toString(), { credentials: 'include', });
    await getSnapshot();
  };

  const saveJob = async (event: any) => {
    event.preventDefault();
    // Obtenemos el formulario
    const form = event.target;
    const body = {
      nombre: `${form.nombre.value.replace(/\s/g, '')} ${form.apellido.value.replace(/\s/g, '')}`,
      email: `${form.email.value}`,
      telefono: ''
    }
    setUserDataLoading(true);
    // Registramos usuario
    await fetch('http://localhost:3000/api/v1/user', { credentials: 'include', method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })
      .then((respose) => respose.json())
      .then((respose) => {
        console.log(respose.data)
        setUserDataLoading(false)
        setModalActive(true)
      })
      .catch(() => {
        console.log("No fue posible registrar usuario");
        setUserDataLoading(false);
      });

  };

  const handleClose = () => setModalActive(false);
  const handleShow = () => setModalActive(true);

  return (
    <>
      <main role="main" className="container mt-5">
        <Container>
          <div className="px-4 py-3 my-5 text-center">
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
          <Card>
            <Card.Body>
              <div className="py-1 my-1 text-center">
                <div className="col-lg-9 mx-auto">
                  <Form noValidate onSubmit={requestSnapshot}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label htmlFor={urlId}>Introduce una URL</Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Text id={urlGroupId}>
                          ejemplo.com
                        </InputGroup.Text>
                        <Form.Control id={urlId} aria-describedby={urlGroupId} name="url" />
                        <Button variant="primary" id="button-addon2" type='submit' disabled={screenshotLoading}>
                          {screenshotLoading ? <span><Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />&nbsp;</span> : null}
                          Aceptar
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Form>
                </div>
              </div>
              <Card className='mx-auto col-lg-9'>
                <Card.Body>
                  <Image id={imgId} rounded={true} src={img} style={{ width: "100%", height: img ? "100%" : "32rem" }} />
                </Card.Body>
              </Card>
              <div className="py-3 my-3">
                <Form noValidate onSubmit={saveJob}>
                  <div className="col-lg-9 mx-auto row">
                    <div className="col-lg-8">
                      <Form.Group className="mb-3" controlId={emailId}>
                        <Form.Label htmlFor={emailGroupId}>¿A dónde enviaremos las alertas?</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control id={emailId} aria-describedby={emailGroupId} name="email" placeholder='ejemplo@gmail.com' />
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-lg-4">
                      <Form.Group className="mb-3" controlId={frecuenciaId}>
                        <Form.Label htmlFor={frecuenciaGroupId}>Frecuencia</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Select aria-label="Selector para frecuencias de monitoreo" id={frecuenciaId} aria-describedby={frecuenciaGroupId} defaultValue={60} name="frecuencia">
                            <option disabled={true}>Frecuencia de monitoreo</option>
                            <option value="5">5 segundos</option>
                            <option value="10">10 segundos</option>
                            <option value="30">30 segundos</option>
                            <option value="60">1 minuto</option>
                            <option value="300">5 minuto</option>
                            <option value="600">10 minuto</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="col-lg-9 mx-auto row">
                    <div className="col-lg-8">
                      <Form.Group className="mb-3" controlId={descripcionId}>
                        <Form.Label htmlFor={descripcionGroupId}>Breve descripción</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control id={descripcionId} aria-describedby={descripcionGroupId} name="descripcion" placeholder='...' />
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-lg-4">
                      <Form.Group className="mb-3" controlId={diferenciaId}>
                        <Form.Label htmlFor={diferenciaGroupId}>Porcentaje de cambio</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Select aria-label="Selector para porcentaje de cambio" id={diferenciaId} aria-describedby={diferenciaGroupId} defaultValue={1} name="diferenciaAlerta">
                            <option disabled={true}>Porcentaje de diferencia para aviso</option>
                            <option value="0">Cualquier cambio</option>
                            <option value="1">Pequeño (1%)</option>
                            <option value="2">Mediano (10%)</option>
                            <option value="3">Considerable (25%)</option>
                            <option value="4">Grande (50%)</option>
                            <option value="5">Enorme (80%)</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="col-lg-9 mx-auto">
                    <Accordion flush={true} alwaysOpen={false}>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Configuración avanzada</Accordion.Header>
                        <Accordion.Body>
                          Trabajo en progreso...
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                  <div className="col-lg-9 mx-auto">
                    <div className="d-grid gap-2">
                      <Button variant="primary" size="lg" type='submit' disabled={userDataLoading}>
                        {userDataLoading ? <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> : null}
                        Empezar a monitorear
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Card.Body>
          </Card>

        </Container>
      </main>
      <Modal show={modalActive} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ahora solo necesitamos tus datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-lg-9 mx-auto row">
            <div className="col-lg-6">
              <Form.Group className="mb-3" controlId={nombreId}>
                <Form.Label htmlFor={nombreGroupId}>Tu nombre</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control id={nombreId} aria-describedby={nombreGroupId} name="nombre" placeholder='Juan' disabled={true} />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-lg-6">
              <Form.Group className="mb-3" controlId={apellidoId}>
                <Form.Label htmlFor={apellidoGroupId}>Tu apellido</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control id={apellidoId} aria-describedby={apellidoGroupId} name="apellido" placeholder='Perez' disabled={true} />
                </InputGroup>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
