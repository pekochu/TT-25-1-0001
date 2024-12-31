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
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Skeleton from 'react-loading-skeleton'
import React, { useEffect, useId, useState } from 'react';
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiSearch, FiStopCircle, FiTrash } from 'react-icons/fi';
import ReactCrop from 'react-image-crop'
import { generateApiUrl, API_WEB_SCREENSHOT_URL, API_WEB_GOTO_URL, API_V1_PAGES } from '@/lib/constants';


interface ISubmitNewPaginaProps {
  show: boolean
  setShow: (_show: boolean) => void
}
export default function EditarPaginaModal({ show, setShow }: ISubmitNewPaginaProps) {

  const urlId = useId();
  const imgId = useId();
  const frecuenciaId = useId();
  const descripcionId = useId();
  const diferenciaId = useId();

  const [validated, setValidated] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [verticalOverflow, setVerticalOverflow] = useState(false);
  const [img, setImg] = useState('/imagen foto navegador.png');

  const getSnapshot = async () => {
    const res = await fetch(generateApiUrl(API_WEB_SCREENSHOT_URL), { credentials: 'include', });
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
    setScreenshotLoading(false);
    setVerticalOverflow(true);
  };

  const requestSnapshot = async (event: any) => {
    event.preventDefault();
    // Obtenemos el formulario
    const form = event.target;
    const urlParams = new URLSearchParams({ url: form.url.value });
    setScreenshotLoading(true);
    // Solicitamos el screenshot del navegador
    const result = await fetch(generateApiUrl(API_WEB_GOTO_URL) + '?' + urlParams.toString(), { credentials: 'include', });
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
    await fetch(generateApiUrl(API_V1_PAGES), { credentials: 'include', method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })
      .then((respose) => respose.json())
      .then((respose) => {
        console.log(respose.data)
        setUserDataLoading(false)
      })
      .catch(() => {
        console.log("No fue posible registrar usuario");
        setUserDataLoading(false);
      });

  };

  return (
    <>
      <Modal show={show} size="xl">
        <Modal.Header closeButton onClick={() => setShow(false)} >
          <Modal.Title>Editar sitio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <div className="py-1 my-1 overflow-y-auto" style={{ height: '100%', width: '100%' }} >
              <Row>
                <Col>
                  <Form noValidate onSubmit={requestSnapshot}>
                    <Form.Group className="mb-3" controlId={urlId}>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          ejemplo.com
                        </InputGroup.Text>
                        <Form.Control aria-describedby={urlId} name="url" />
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
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Card className=''>
                    <Card.Body className='p-0'>
                      <div className='flex flex-1 rounded overflow-auto' style={{ height: verticalOverflow ? "28rem" : "auto" }} >
                        <div className='relative'>
                          {screenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                            <Image id={imgId} rounded={true} src={img} style={{ maxWidth: "100%", height: "auto" }} />}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Accordion flush={false} alwaysOpen={true}>
                    <Accordion.Item eventKey="0" >
                      <Accordion.Header>Configuración básica</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          <Form.Group className="mb-3" controlId={descripcionId}>
                            <Form.Label>Breve descripción</Form.Label>
                            <InputGroup className="mb-3">
                              <Form.Control aria-describedby={descripcionId} name="descripcion" placeholder='...' />
                            </InputGroup>
                          </Form.Group>
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId={frecuenciaId}>
                                <Form.Label>Frecuencia</Form.Label>
                                <InputGroup className="mb-3">
                                  <Form.Select aria-label="Selector para frecuencias de monitoreo" aria-describedby={frecuenciaId} defaultValue={60} name="frecuencia">
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
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId={diferenciaId}>
                                <Form.Label>Porcentaje de cambio</Form.Label>
                                <InputGroup className="mb-3">
                                  <Form.Select aria-label="Selector para porcentaje de cambio" aria-describedby={diferenciaId} defaultValue={1} name="diferenciaAlerta">
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
                            </Col>
                          </Row>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" >
                      <Accordion.Header>Tipo de comparación</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          <div key='inline-radio' className="mb-3">
                            <Form.Check
                              inline
                              label="Visual"
                              name="group1"
                              type='radio'
                            />
                            <Form.Check
                              inline
                              label="Texto"
                              name="group1"
                              type='radio'
                            />
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" >
                      <Accordion.Header>Acciones</Accordion.Header>
                      <Accordion.Body>

                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" >
                      <Accordion.Header>Ajustes</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId={frecuenciaId}>
                                <Form.Label>Pantalla</Form.Label>
                                <InputGroup className="mb-3">
                                  <Form.Select aria-label="Selector para frecuencias de monitoreo" aria-describedby={frecuenciaId} defaultValue={1} name="frecuencia">
                                    <option disabled={true}>Area a cubrir para el chequeo</option>
                                    <option value="1">Toda la pagina</option>
                                    <option value="2">Un area</option>
                                  </Form.Select>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId={diferenciaId}>
                                <Form.Label>Tiempo de espera</Form.Label>
                                <InputGroup className="mb-3">
                                  <Form.Select aria-label="Selector para porcentaje de cambio" aria-describedby={diferenciaId} defaultValue={1} name="diferenciaAlerta">
                                    <option disabled={true}>Espera después de realizar las acciones</option>
                                    <option value="0">Nada</option>
                                    <option value="1">Esperar 2 segundos</option>
                                    <option value="2">Esperar 5 segundos</option>
                                    <option value="3">Esperar 7 segundos</option>
                                  </Form.Select>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                </Col>
              </Row>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Stack direction="horizontal" gap={3} style={{ width: '100%' }}>
            <Button className="me-auto" variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>{' '}
            <Button variant="primary" type='submit' disabled={userDataLoading}>
              {userDataLoading ? <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> : null}
              Realizar cambios
            </Button>{' '}
          </Stack>


        </Modal.Footer>
      </Modal>

    </>
  );
}
