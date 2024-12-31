import 'react-image-crop/dist/ReactCrop.css'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from '../Dashboard.module.css'

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
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Badge from 'react-bootstrap/Badge';
import Skeleton from 'react-loading-skeleton'
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useId, useState } from 'react';
import ReactCrop from 'react-image-crop';
import useSWR, { SWRConfig } from 'swr';
import Cookies from 'universal-cookie';
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiSearch, FiSettings, FiStopCircle, FiTrash } from 'react-icons/fi';
import { generateApiUrl, API_WEB_SCREENSHOT_URL, API_V1_PAGES } from '@/lib/constants';
import fetcher from '@/util/fetcher';
import Paginas from './Paginas';
import Resultados from './Resultados';
import SubmitNewPaginaModal from './SubmitNewPagina';
import EditarSitioModal from './EditarSitio';
import DetallesResultadosModal from './DetallesResultados';

export default function DashboardComponent() {

  const searchForPage = useId();
  const imgId = useId();
  const nombreId = useId();
  const apellidoId = useId();
  const emailId = useId();
  const frecuenciaId = useId();
  const descripcionId = useId();
  const diferenciaId = useId();

  const [validated, setValidated] = useState(false);
  const [newPaginaModal, showNewPaginaModal] = useState(false);
  const [editarSitioModal, showEditarSitioModal] = useState(false);
  const [verDetallesResultadosModal, showDetallesResultadosModal] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(true);
  const [verticalOverflow, setVerticalOverflow] = useState(false);
  const [paginaSeleccionada, setPaginaSeleccionada] = useState<any | null>(null);
  const [resultadoSeleccionado, detallesResultados] = useState<any | null>(null);
  const [img, setImg] = useState('/imagen foto navegador.png');
  const [frecuencia, setFrecuencia] = useState('60');
  const [diferencia, setDiferencia] = useState('1');
  const [tipoComparacion, setTipoComparacion] = useState('visual');
  const [notifCorreo, setNotifCorreo] = useState(true);
  const [notifWhats, setNotifWhats] = useState(false);

  const cargarDetallesPagina = async (pag: any) => {
    console.log(`Here`);
    console.log(pag);
    let diferenciaAlerta = '0';
    switch (pag.diferenciaAlerta) {
      case 0:
        diferenciaAlerta = '0';
        break;
      case 1:
        diferenciaAlerta = '1';
        break;
      case 10:
        diferenciaAlerta = '2';
        break;
      case 25:
        diferenciaAlerta = '3';
        break;
      case 50:
        diferenciaAlerta = '4';
        break;
      case 80:
        diferenciaAlerta = '5';
        break;
    }
    setFrecuencia(`${pag.frecuencia}`);
    setDiferencia(`${diferenciaAlerta}`);
    setTipoComparacion(pag.modo);
    setNotifWhats(!!pag.notifWhatsapp);
    setNotifCorreo(!!pag.notifEmail);
    // Cargar imagen
    const res = await fetch(generateApiUrl(`/api/v1/pages/${pag.id}/getBaseImage`), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${new Cookies().get('token')}`
      },
    });
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
    setScreenshotLoading(false);
    setVerticalOverflow(true);
  };

  const actualizarPagina = async (event: any) => {
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
      "id": paginaSeleccionada.id,
      "frecuencia": frecuencia,
      "diferenciaAlerta": diferenciaAlerta,
      "notifEmail": notifCorreo,
      "notifWhatsapp": notifWhats,
    };
    console.log(body);
    setUserDataLoading(true);
    // Registramos usuario
    await fetch(generateApiUrl(API_V1_PAGES), { credentials: 'include', method: 'PATCH', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })
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

  const {
    data: paginas,
    error,
    mutate,
  } = useSWR<any>(generateApiUrl('/api/v1/pages'), fetcher);

  const {
    data: resultados,
    error: errorResults,
    mutate: mutateResults,
  } = useSWR<any>(paginaSeleccionada ? generateApiUrl(`/api/v1/pages/${paginaSeleccionada.id}/results`) : null, fetcher);

  return (
    <SWRConfig>
      <style global jsx>{`
        main .dropdown-toggle::after {
          display: none !important;
        }
      `}</style>
      <main role="main" className="m-4" style={{ minHeight: '680px' }}>
        <Container fluid={true}>
          <Row>
            <Col lg='5'>
              <Card border='primary'>
                <Card.Header>
                  Panel de control
                </Card.Header>
                <Card.Body>
                  <div>
                    <Form.Group className="mb-3" controlId={searchForPage}>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <FiSearch />
                        </InputGroup.Text>
                        <Form.Control aria-describedby={searchForPage} name="jobs" placeholder='Busca alguna pagina' />
                      </InputGroup>
                    </Form.Group>
                  </div>
                  <div className="border-top border-bottom py-3">
                    <Stack direction="horizontal" gap={3}>
                      <Button variant="link"><FiPlay className='mx-3' /></Button>{' '}
                      <div className="vr" />
                      <Button variant="primary" className="ms-auto" onClick={() => showNewPaginaModal(true)}><FiPlusCircle /> Nueva página</Button>{' '}
                    </Stack>
                  </div>
                  <div className='mt-3'>
                    <p className="fw-bold">Páginas registradas para monitoreo</p>
                    <Paginas error={error} isLoading={!paginas} paginas={paginas} mutate={mutate} onSelect={(pag) => { cargarDetallesPagina(pag), setPaginaSeleccionada(pag) }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg='7'>
              {paginaSeleccionada ? <>
                <Card border='warning' key={paginaSeleccionada.id}>
                  <Card.Header>
                    <Stack direction="horizontal" gap={3}>
                      <span className="me-auto">{paginaSeleccionada.url} | {paginaSeleccionada.descripcion}</span>
                      <div className="vr" />
                      <Button variant="primary" className="" onClick={(e) => actualizarPagina(e)}><FiSettings /> Guardar</Button>{' '}
                    </Stack>

                  </Card.Header>
                  <Card.Body>
                    <div className=''>
                      <Container fluid={true}>
                        <Row>
                          <Col lg='4'>
                            <Row>
                              <Form.Group className="mb-3" controlId={frecuenciaId}>
                                <Form.Label>Frecuencia</Form.Label>
                                <InputGroup className="mb-0">
                                  <Form.Select aria-label="Selector para frecuencias de monitoreo" aria-describedby={frecuenciaId} value={frecuencia} name="frecuencia" onChange={(e) => {
                                    setFrecuencia(e.target.value)
                                  }} >
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
                                  </Form.Select>
                                </InputGroup>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group className="mb-0" controlId={diferenciaId}>
                                <Form.Label>Porcentaje de cambio</Form.Label>
                                <InputGroup className="mb-3">
                                  <Form.Select aria-label="Selector para porcentaje de cambio" aria-describedby={diferenciaId} defaultValue={1} name="diferenciaAlerta" value={diferencia} onChange={(e) => {
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
                            </Row>
                            <Row>
                              <Form.Group className="mb-0" controlId={diferenciaId}>
                                <Form.Label>Tipo de comparación</Form.Label>
                                <InputGroup className="mb-3">
                                  <div className="">
                                    <div key='inline-radio' className="mb-3">
                                      <Form.Check
                                        inline
                                        disabled
                                        label="Visual"
                                        name="group1"
                                        type='radio'
                                        defaultChecked={tipoComparacion.toLowerCase() === 'visual'}
                                      />
                                      <Form.Check
                                        inline
                                        disabled
                                        label="Texto"
                                        name="group1"
                                        type='radio'
                                        defaultChecked={tipoComparacion.toLowerCase() === 'texto'}
                                      />
                                    </div>
                                  </div>
                                </InputGroup>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group className="mb-0" controlId={diferenciaId}>
                                <Form.Label>Notificaciones</Form.Label>
                                <InputGroup className="mb-3">
                                  <div className="">
                                    <div key='inline-radio' className="mb-3">
                                      <Form.Check // prettier-ignore
                                        type="switch"
                                        id="custom-switch"
                                        label="Por correo electrónico"
                                        defaultChecked={notifCorreo}
                                        onChange={(e) => {
                                          setNotifCorreo(e.target.checked)
                                        }}
                                      />
                                      <Form.Check // prettier-ignore
                                        type="switch"
                                        label="Por WhatsApp"
                                        id="disabled-custom-switch"
                                        defaultChecked={notifWhats}
                                        onChange={(e) => {
                                          setNotifWhats(e.target.checked)
                                        }}
                                      />
                                    </div>
                                  </div>
                                </InputGroup>
                              </Form.Group>
                            </Row>
                          </Col>
                          <Col lg='8'>
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
                        </Row>
                      </Container>
                    </div>
                    <div className='mt-3'>
                      <p className="fw-bold">Lista de resultados</p>
                      <Resultados error={errorResults} isLoading={!resultados} resultados={resultados} mutate={mutateResults} onSelect={detallesResultados} onClick={() => showDetallesResultadosModal(true)} />
                    </div>
                  </Card.Body>
                </Card>
              </> : <>
                <Card border='danger' className="text-center">
                  <Card.Header>¡Hola!</Card.Header>
                  <Card.Body>
                    <Card.Title>Cambios detectados</Card.Title>
                    <Card.Text>
                      Selecciona una página para ver los cambios detectados y la programación de futuros chequeos.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-muted">ESCOMONITOR</Card.Footer>
                </Card>
              </>}

            </Col>
          </Row>


        </Container>
      </main >
      <SubmitNewPaginaModal show={newPaginaModal} setShow={showNewPaginaModal} />
      <EditarSitioModal show={editarSitioModal} setShow={showEditarSitioModal} />
      <DetallesResultadosModal show={verDetallesResultadosModal} resultado={resultadoSeleccionado} pagina={paginaSeleccionada} setShow={showDetallesResultadosModal} />
    </SWRConfig>
  );
}
