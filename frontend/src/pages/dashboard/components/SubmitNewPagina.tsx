import 'react-image-crop/dist/ReactCrop.css'
import 'react-loading-skeleton/dist/skeleton.css'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DragDropContext, Droppable, Draggable, DroppableProps } from "react-beautiful-dnd";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Skeleton from 'react-loading-skeleton'
import React, { useEffect, useId, useState } from 'react';
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiEdit, FiStopCircle, FiTrash, FiAlignJustify } from 'react-icons/fi';
import ReactCrop, { type Crop } from 'react-image-crop';
import { generateApiUrl, API_WEB_SCREENSHOT_URL, API_V1_PAGES, API_WEB_TITLE, API_WEB_GOTO_URL, API_WEB_PERFORM_ACTIONS } from '@/lib/constants';
import StrictModeDroppable from '@/pages/components/StrictModeDroppable';

const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }));

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const placeholderAction: Record<string, any> = {
  "click": { placeholder: "Nombre (o XPATH)", inputEnabled: true },
  "doubleclick": { placeholder: "Nombre (o XPATH)", inputEnabled: true },
  "wait": { placeholder: "Tiempo en segundos", inputEnabled: true },
  "refresh": { placeholder: "Actualizar activado", inputEnabled: false },
  "scroll": { placeholder: "Scroll hasta llegar al tope", inputEnabled: false },
  "goto": { placeholder: "URL para navegar", inputEnabled: true }
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "white" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "white"
});


interface ISubmitNewPaginaProps {
  show: boolean
  setShow: (_show: boolean) => void
}
export default function SubmitNewPaginaModal({ show, setShow }: ISubmitNewPaginaProps) {

  const urlId = useId();
  const imgId = useId();
  const frecuenciaId = useId();
  const descripcionId = useId();
  const diferenciaId = useId();
  const tipoComparacionId = useId();
  const areaMonitorId = useId();
  const tiempoEsperaId = useId();

  const [validated, setValidated] = useState({ value: '' });
  const [recorte, setRecorte] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [verticalOverflow, setVerticalOverflow] = useState(false);
  const [img, setImg] = useState('/imagen foto navegador.png');
  const [imgDimensions, setImgDimensions] = useState({ width: 1, height: 1, naturalWidth: 1, naturalHeight: 1 });
  const [actionPlaceholder, setActionPlaceholder] = useState('Nombre (o XPATH)');
  const [actionEnabled, setActionEnabled] = useState(true);

  const [url, setUrl] = useState('');
  const [frecuencia, setFrecuencia] = useState('60');
  const [descripcion, setDescripcion] = useState('');
  const [diferencia, setDiferencia] = useState('1');
  const [tipoComparacion, setTipoComparacion] = useState('visual');
  const [areaMonitor, setAreaMonitor] = useState(false);
  const [tiempoEspera, setTiempoEspera] = useState('2');
  const [dndState, setDndState] = useState(getItems(0));
  const [action, setAction] = useState(['click']);
  const [nameXpath, setNameXpath] = useState(['']);

  const getSnapshot = async () => {
    const res = await fetch(generateApiUrl(API_WEB_SCREENSHOT_URL), { credentials: 'include', });

    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    if (descripcion == "") {
      await fetch(generateApiUrl(API_WEB_TITLE), { credentials: 'include', method: 'GET', headers: { 'content-type': 'application/json' } })
        .then((response) => response.json())
        .then((response) => {
          setDescripcion(response.title)
        })
    }

    setImg(imageObjectURL);
    setScreenshotLoading(false);
    setVerticalOverflow(true);
  };

  const performActions = async () => {
    setVerticalOverflow(false);
    setScreenshotLoading(true);

    let actionsList = [];
    for (const index in nameXpath) {
      actionsList.push({ action: action[index], value: nameXpath[index] });
    }

    const resultActions = await fetch(generateApiUrl(API_WEB_PERFORM_ACTIONS), { credentials: 'include', method: 'POST', body: JSON.stringify({ url: url, preacciones: actionsList }), headers: { 'content-type': 'application/json' } });
    console.log(resultActions);

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
    const body: Record<string, any> = {
      "url": url,
      "descripcion": descripcion,
      "frecuencia": frecuencia,
      "diferenciaAlerta": diferenciaAlerta,
      "modo": tipoComparacion,
      "tiempoEspera": parseInt(tiempoEspera)
    };

    if (areaMonitor) {
      const scaleX = imgDimensions.naturalWidth / imgDimensions.width;
      const scaleY = imgDimensions.naturalHeight / imgDimensions.height;
      console.log('imgDimensions');
      console.log(imgDimensions);
      body.corte_ancho = recorte.width * scaleX;
      body.corte_alto = recorte.height * scaleY;
      body.corte_x = recorte.x * scaleX;
      body.corte_y = recorte.y * scaleY;
      body.unidades = recorte.unit;
    }

    let actionsList = [];
    for (const index in nameXpath) {
      actionsList.push({ action: action[index], value: nameXpath[index] });
    }

    if (actionsList.length > 0) {
      body.preacciones = actionsList;
    }
    console.log(body);
    setUserDataLoading(true);
    // Registramos usuario
    await fetch(generateApiUrl(API_V1_PAGES), { credentials: 'include', method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })
      .then((respose) => respose.json())
      .then((respose) => {
        console.log(respose.data)
        setUserDataLoading(false)
      })
      .catch(() => {
        console.log("No fue posible registrar una nueva página");
        setUserDataLoading(false);
      });

  };

  const onDragEnd = async (result: any, provided: any) => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    const itemsDnd = reorder(dndState, source.index, destination.index);
    setDndState(itemsDnd);

    const itemsActions = reorder(action, source.index, destination.index);
    setAction(itemsActions);

    const itemsNameXpath = reorder(nameXpath, source.index, destination.index);
    setNameXpath(itemsNameXpath);
  };

  return (
    <>
      <Modal show={show} size="xl">
        <Modal.Header closeButton onClick={() => setShow(false)} >
          <Modal.Title>Monitorear una nueva página</Modal.Title>
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
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Card className=''>
                    <Card.Body className='p-0'>
                      <div className='flex flex-1 rounded overflow-auto' style={{ height: verticalOverflow ? "28rem" : "auto" }} >
                        <div className='relative'>
                          {screenshotLoading ? <><Skeleton style={{ height: "26rem" }} /></> : <>
                            {areaMonitor ? <ReactCrop crop={recorte} onChange={c => setRecorte(c)}>
                              <Image id={imgId} rounded={true} src={img} style={{ maxWidth: "100%", height: "auto" }} onLoad={event => {
                                setImgDimensions({ naturalWidth: event.currentTarget.naturalWidth, naturalHeight: event.currentTarget.naturalHeight, width: event.currentTarget.width, height: event.currentTarget.height });
                              }} />
                            </ReactCrop> : <Image id={imgId} rounded={true} src={img} style={{ maxWidth: "100%", height: "auto" }} />}</>
                          }
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
                              <Form.Control aria-describedby={descripcionId} name="descripcion" placeholder='...' defaultValue={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                            </InputGroup>
                          </Form.Group>
                          <Row>
                            <Col lg={6}>
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
                                    <option value="300">5 minutos</option>
                                    <option value="600">10 minutos</option>
                                    <option value="900">15 minutos</option>
                                    <option value="1800">30 minutos</option>
                                    <option value="3600">1 hora</option>
                                    <option value="10800">3 horas</option>
                                    <option value="21600">6 horas</option>
                                    <option value="43200">12 horas</option>
                                    <option value="86400">Diario</option>
                                    <option value="604800">Semanal</option>
                                  </Form.Select>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId={diferenciaId}>
                                <Form.Label>Porcentaje de cambio</Form.Label>
                                <InputGroup className="mb-3">
                                  <Form.Select aria-label="Selector para porcentaje de cambio" aria-describedby={diferenciaId} defaultValue={1} name="diferenciaAlerta">
                                    <option disabled={true}>El porcentaje de diferencia debe superar este valor para recibir el aviso</option>
                                    <option value="0">Cualquier cambio</option>
                                    <option value="1">Pequeño (mayor al 1%)</option>
                                    <option value="2">Mediano (mayor al 10%)</option>
                                    <option value="3">Considerable (mayor al 25%)</option>
                                    <option value="4">Grande (mayor al 50%)</option>
                                    <option value="5">Enorme (mayor al 80%)</option>
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
                        <Form.Group className="my-1" controlId={tipoComparacionId}>
                          <InputGroup className="mb-0">
                            <div className="">
                              <div key='inline-radio' className="mb-3">
                                <Form.Check
                                  inline
                                  label="Visual"
                                  name="tipoComparacion"
                                  type='radio'
                                  defaultChecked={true}
                                  onChange={(e) => {
                                    setTipoComparacion('visual')
                                  }}
                                />
                                <Form.Check
                                  inline
                                  label="Texto"
                                  name="tipoComparacion"
                                  type='radio'
                                  onChange={(e) => {
                                    setTipoComparacion('texto')
                                  }}
                                />
                              </div>
                            </div>
                          </InputGroup>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" >
                      <Accordion.Header>Acciones</Accordion.Header>
                      <Accordion.Body>
                        <DragDropContext onDragEnd={onDragEnd} >
                          <StrictModeDroppable droppableId="droppable">
                            {(provided: any, snapshot: any) => (
                              <ListGroup
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                              >
                                {dndState.map((item, index) => (
                                  <Draggable key={`${item.id}`} draggableId={`${item.id}`} index={index}>
                                    {(provided: any, snapshot: any) => (
                                      <ListGroup.Item className="d-flex justify-content-between"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                          snapshot.isDragging,
                                          provided.draggableProps.style
                                        )}
                                      >
                                        <Container>
                                          <Row className="justify-content-md-center">

                                            <Col xs lg="4">
                                              <Form.Group className="" controlId={`action-${item.id}`}>
                                                <InputGroup className="">
                                                  <InputGroup.Text><FiAlignJustify /></InputGroup.Text>
                                                  <Form.Select aria-label="Selector de acción" aria-describedby={`action-${item.id}`} defaultValue={action[index]} name={`action-${item.id}`} onChange={(e) => {
                                                    action[index] = e.target.value;
                                                    setAction(action);
                                                    setActionPlaceholder(placeholderAction[`${e.target.value as string}`].placeholder);
                                                    setActionEnabled(placeholderAction[`${e.target.value as string}`].inputEnabled);
                                                  }}>
                                                    <option disabled={true}>Tipo de acción</option>
                                                    <option value="click">Click</option>
                                                    <option value="doubleclick">Doble click</option>
                                                    <option value="wait">Esperar</option>
                                                    <option value="refresh">Actualizar</option>
                                                    <option value="scroll">Scrollear</option>
                                                    <option value="goto">Ir a URL</option>
                                                  </Form.Select>
                                                </InputGroup>
                                              </Form.Group>
                                            </Col>
                                            <Col xs lg="8">
                                              <Form.Group className="" controlId={`name-xpath-${item.id}`}>
                                                <InputGroup className="">
                                                  <InputGroup.Text><FiEdit /></InputGroup.Text>
                                                  <Form.Control aria-describedby={`name-xpath-${item.id}`} name={`name-xpath-${item.id}`} value={nameXpath[index]} placeholder={actionPlaceholder} disabled={!actionEnabled} required={actionEnabled} onChange={(e) => {
                                                    setValidated({ value: e.target.value });
                                                    nameXpath[index] = e.target.value;
                                                    setNameXpath(nameXpath);
                                                  }} />
                                                  <InputGroup.Text><FiTrash
                                                    type="button"
                                                    onClick={() => {
                                                      // Borrar elementos
                                                      const newDndState = [...dndState];
                                                      newDndState.splice(index, 1);
                                                      setDndState(newDndState);
                                                      // Borrar actions
                                                      const newActionState = [...action];
                                                      newActionState.splice(index, 1);
                                                      setAction(newActionState);
                                                      // Borrar name xpath
                                                      const newNameXpath = [...nameXpath];
                                                      newNameXpath.splice(index, 1);
                                                      setNameXpath(newNameXpath);
                                                    }}
                                                  /></InputGroup.Text>
                                                </InputGroup>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Container>
                                      </ListGroup.Item>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </ListGroup>
                            )}
                          </StrictModeDroppable>
                        </DragDropContext>
                        <div className="d-flex gap-2 my-2">
                          <Button variant="light" disabled={!(validated.value || dndState.length == 0)} onClick={() => {
                            // Agregar movibles
                            dndState.push(getItems(1)[0]);
                            setDndState(dndState);
                            // Agregar acciones
                            action.push('click');
                            setAction(action);
                            // Agregar xpath o valores
                            nameXpath.push('');
                            setNameXpath(nameXpath);
                            setValidated({ value: '' });
                          }}>
                            <FiPlusCircle /> Agregar otra acción
                          </Button>
                          <Button variant="secondary" disabled={!validated.value} size="sm" onClick={() => { performActions() }}>
                            <FiPlayCircle /> Realizar acciones
                          </Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" >
                      <Accordion.Header>Ajustes</Accordion.Header>
                      <Accordion.Body>
                        <div className="col-lg-12 row">
                          <div className="col-lg-6">
                            <Form.Group className="mb-3" controlId={areaMonitorId}>
                              <Form.Label>Área de monitoreo</Form.Label>
                              <InputGroup className="mb-3">
                                <Form.Select aria-label="Selector para área de monitoreo" aria-describedby={areaMonitorId} defaultValue="0" name="areaMonitor" onChange={(e) => {
                                  setAreaMonitor(e.target.value === "1")
                                }}>
                                  <option disabled={true}>Área de monitoreo</option>
                                  <option value="0">Completa</option>
                                  <option value="1">Recorte</option>
                                </Form.Select>
                              </InputGroup>
                            </Form.Group>
                          </div>
                          <div className="col-lg-6">
                            <Form.Group className="mb-3" controlId={tiempoEsperaId}>
                              <Form.Label>Tiempo de espera</Form.Label>
                              <InputGroup className="mb-3">
                                <Form.Select aria-label="Selector para tiempo de espera después de que la página cargó" aria-describedby={tiempoEsperaId} defaultValue={tiempoEspera} name="tiempoEspera" onChange={(e) => {
                                  setTiempoEspera(e.target.value)
                                }}>
                                  <option disabled={true}>Tiempo de espera después de que la página cargó</option>
                                  <option value="0">Esperar 0 segundos</option>
                                  <option value="2">Esperar 2 segundos</option>
                                  <option value="5">Esperar 5 segundos</option>
                                  <option value="7">Esperar 7 segundos</option>
                                </Form.Select>
                              </InputGroup>
                            </Form.Group>
                          </div>
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
            <Button variant="primary" type='submit' disabled={userDataLoading} onClick={saveJob}>
              {userDataLoading ? <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> : null}
              Registrar
            </Button>{' '}
          </Stack>


        </Modal.Footer>
      </Modal >

    </>
  );
}