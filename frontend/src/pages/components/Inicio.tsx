import 'react-image-crop/dist/ReactCrop.css'
import 'react-loading-skeleton/dist/skeleton.css'

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
import Skeleton from 'react-loading-skeleton'
import React, { useEffect, useId, useState } from 'react';
import ReactCrop from 'react-image-crop'
import { useAuth } from '@/providers/auth/AuthProvider';
import { generateApiUrl, API_SCREENSHOT_URL } from '@/lib/constants';
import { response } from 'express';

export default function InicioComponent() {
  const {
    logIn,
  } = useAuth();
  const urlId = useId();
  const imgId = useId();
  const nombreId = useId();
  const emailId = useId();
  const telefonoId = useId();
  const frecuenciaId = useId();
  const descripcionId = useId();
  const diferenciaId = useId();

  const [validated, setValidated] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalSuccessActive, setModalSuccessActive] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [verticalOverflow, setVerticalOverflow] = useState(false);
  const [img, setImg] = useState('/imagen foto navegador.png');

  const [url, setUrl] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [frecuencia, setFrecuencia] = useState('60');
  const [descripcion, setDescripcion] = useState('');
  const [diferencia, setDiferencia] = useState('1');

  const getSnapshot = async () => {
    const res = await fetch(generateApiUrl(API_SCREENSHOT_URL), { credentials: 'include', });
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    if (descripcion == "") {
      await fetch('http://localhost:3000/api/v1/title', { credentials: 'include', method: 'GET', headers: { 'content-type': 'application/json' } })
        .then((response) => response.json())
        .then((response) => {
          setDescripcion(response.title)
        })
    }
    setImg(imageObjectURL);
    setScreenshotLoading(false);
    setVerticalOverflow(true);
  };

  const firstInteraction = async (event: any) => {
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
    let diferenciaAlerta = 0;
    switch (diferencia) {
      case '0':
        diferenciaAlerta = 0;
        break;
      case '1':
        diferenciaAlerta = 1;
        break;
      case '2':
        diferenciaAlerta = 10;
        break;
      case '3':
        diferenciaAlerta = 25;
        break;
      case '4':
        diferenciaAlerta = 50;
        break;
      case '5':
        diferenciaAlerta = 80;
        break;
    }
    const body = {
      "url": url,
      "email": email,
      "descripcion": descripcion,
      "nombre": nombre,
      "telefono": telefono,
      "frecuencia": frecuencia,
      "diferenciaAlerta": diferenciaAlerta,
      "modo": "VISUAL"
    }
    console.log(body)
    setUserDataLoading(true);
    // Registramos usuario
    await fetch('http://localhost:3000/api/v1/user', { credentials: 'include', method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })
      .then((respose) => respose.json())
      .then((respose) => {
        if (!!respose.success) {
          console.log(respose.data)
          setUserDataLoading(false)
          setModalActive(false)
          logIn({ email })
          setModalSuccessActive(true)
        } else {
          console.log("No fue posible registrar usuario");
          setUserDataLoading(false);
        }

      })
      .catch(() => {
        console.log("No fue posible registrar usuario");
        setUserDataLoading(false);
      });

  };

  const handleClose = () => setModalActive(false);
  const handleShow = () => setModalActive(true);

  const handleSuccessClose = () => setModalSuccessActive(false);
  const handleSuccessShow = () => setModalSuccessActive(true);


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
                  <Form noValidate onSubmit={firstInteraction}>
                    <Form.Group className="mb-3" controlId={urlId}>
                      <Form.Label>Introduce una URL</Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          ejemplo.com
                        </InputGroup.Text>
                        <Form.Control aria-describedby={urlId} name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                        <Button variant="primary" type='submit' disabled={screenshotLoading}>
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
                <Card.Body className='p-0'>
                  <div className='flex flex-1 rounded overflow-auto' style={{ height: verticalOverflow ? "28rem" : "auto" }} >
                    <div className='relative'>
                      {screenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                        <Image id={imgId} rounded={true} src={img} style={{ maxWidth: "100%", height: "auto" }} />}
                    </div>
                  </div>

                </Card.Body>
              </Card>
              <div className="py-3 my-3">
                <Form onSubmit={(e) => { e.preventDefault(), setModalActive(true) }}>
                  <div className="col-lg-9 mx-auto row">
                    <div className="col-lg-8">
                      <Form.Group className="mb-3" controlId={emailId}>
                        <Form.Label>¿A dónde enviaremos las alertas?</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control aria-describedby={emailId} name="email" placeholder='ejemplo@gmail.com' required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-lg-4">
                      <Form.Group className="mb-3" controlId={frecuenciaId}>
                        <Form.Label>Frecuencia</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Select aria-label="Selector para frecuencias de monitoreo" aria-describedby={frecuenciaId} defaultValue={frecuencia} name="frecuencia" required onChange={(e) => {
                            setFrecuencia(e.target.value)
                          }}>
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
                        <Form.Label>Breve descripción</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control aria-describedby={descripcionId} name="descripcion" placeholder='...' required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-lg-4">
                      <Form.Group className="mb-3" controlId={diferenciaId}>
                        <Form.Label>Porcentaje de cambio</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Select aria-label="Selector para porcentaje de cambio" aria-describedby={diferenciaId} defaultValue={diferencia} name="diferenciaAlerta" onChange={(e) => {
                            setDiferencia(e.target.value)
                          }}>
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
                <Form.Label>Tu nombre y apellido</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control aria-describedby={nombreId} name="nombre" placeholder='Juan Perez' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-lg-6">
              <Form.Group className="mb-3" controlId={telefonoId}>
                <Form.Label>Tu número de teléfono</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control aria-describedby={telefonoId} name="telefono" placeholder='5512345678' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </InputGroup>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={saveJob}>
            Guardar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalSuccessActive} onHide={handleSuccessClose}>
        <Modal.Header closeButton>
          <Modal.Title>Casi listo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ahora recibirás un correo electrónico para activar tu cuenta
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSuccessClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
