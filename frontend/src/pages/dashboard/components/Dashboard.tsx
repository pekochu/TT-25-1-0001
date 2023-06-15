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
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiSearch, FiSettings, FiStopCircle, FiTrash } from 'react-icons/fi';
import { generateApiUrl, API_SCREENSHOT_URL } from '@/lib/constants';
import fetcher from '@/util/fetcher';
import Paginas from './Paginas';
import SubmitNewPaginaModal from './SubmitNewPagina';
import EditarSitioModal from './EditarSitio';

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
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [verticalOverflow, setVerticalOverflow] = useState(false);
  const [paginaSeleccionada, setPaginaSeleccionada] = useState<any | null>(null);
  const [img, setImg] = useState('/imagen foto navegador.png');

  const {
    data: paginas,
    error,
    mutate,
  } = useSWR<any>(generateApiUrl('/api/v1/test'), fetcher);

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
            <Col lg='6'>
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
                    <p className="fw-bold">Trabajos activos</p>
                    <Paginas error={error} isLoading={!paginas} paginas={paginas} mutate={mutate} onSelect={setPaginaSeleccionada} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg='6'>
              {paginaSeleccionada ? (
                <Card border='warning'>
                  <Card.Header>
                    <Stack direction="horizontal" gap={3}>
                      <span className="me-auto">{paginaSeleccionada.descripcion}</span>
                      <div className="vr" />
                      <Button variant="primary" className="" onClick={() => showEditarSitioModal(true)}><FiSettings /> Configuración</Button>{' '}
                    </Stack>

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
                        <Button variant="primary" className="ms-auto"><FiPlusCircle /> Nueva página</Button>{' '}
                      </Stack>
                    </div>
                    <div className='mt-3'>
                      <p className="fw-bold">Trabajos activos</p>
                      <Paginas error={error} isLoading={!paginas} paginas={paginas} mutate={mutate} onSelect={setPaginaSeleccionada} />
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Card border='danger' className="text-center">
                  <Card.Header>¡Hola!</Card.Header>
                  <Card.Body>
                    <Card.Title>Cambios detectados y futuros chequeos</Card.Title>
                    <Card.Text>
                      Selecciona una página para ver los cambios detectados y la programación de futuros chequeos.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-muted">ESCOMONITOR</Card.Footer>
                </Card>
              )}

            </Col>
          </Row>


        </Container>
      </main >
      <SubmitNewPaginaModal show={newPaginaModal} setShow={showNewPaginaModal} />
      <EditarSitioModal show={editarSitioModal} setShow={showEditarSitioModal} />
    </SWRConfig>
  );
}
