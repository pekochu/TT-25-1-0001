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
import { generateApiUrl, API_SCREENSHOT_URL } from '@/lib/constants';
import fetcher from '@/util/fetcher';
import Usuarios from './AdminUsuarios';
import Paginas from './AdminPaginas';
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
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any | null>(null);
  const [paginaSeleccionada, setPaginaSeleccionada] = useState<any | null>(null);
  const [img, setImg] = useState('/imagen foto navegador.png');
  const [frecuencia, setFrecuencia] = useState('60');
  const [diferencia, setDiferencia] = useState('1');

  const cargarDetallesPagina = async (pag: any) => {
    console.log(`Here`);
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
    setFrecuencia(pag.frecuencia);
    setDiferencia(diferenciaAlerta);
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

  const {
    data: users,
    error,
    mutate,
  } = useSWR<any>(generateApiUrl('/api/v1/users'), fetcher);

  const {
    data: paginas,
    error: errorPaginas,
    mutate: mutatePaginas,
  } = useSWR<any>(usuarioSeleccionado ? generateApiUrl(`/api/v1/users/${usuarioSeleccionado.id}/pages`) : null, fetcher);

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
                  Panel de Administrador
                </Card.Header>
                <Card.Body>
                  <div>
                    <Form.Group className="mb-3" controlId={searchForPage}>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <FiSearch />
                        </InputGroup.Text>
                        <Form.Control aria-describedby={searchForPage} name="jobs" placeholder='Buscar usuario' />
                      </InputGroup>
                    </Form.Group>
                  </div>
                  <div className='mt-3'>
                    <p className="fw-bold">Usuarios registrados</p>
                    <Usuarios error={error} isLoading={!users} users={users} mutate={mutate} onSelect={(pag) => { cargarDetallesPagina(pag), setUsuarioSeleccionado(pag) }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg='7'>
              {usuarioSeleccionado ? (
                <Card border='warning'>
                  <Card.Header>
                    <Stack direction="horizontal" gap={3}>
                      <span className="me-auto">{usuarioSeleccionado.nombre} | {usuarioSeleccionado.email}</span>
                    </Stack>

                  </Card.Header>
                  <Card.Body>
                    <div className=''>
                      <p className="fw-bold">Páginas registradas por usuarios</p>
                      <Paginas error={errorPaginas} isLoading={!paginas} paginas={paginas} mutate={mutatePaginas} onSelect={(pag) => { setPaginaSeleccionada(pag) }} />
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Card border='danger' className="text-center">
                  <Card.Header>¡Hola, administrador!</Card.Header>
                  <Card.Body>
                    <Card.Title>Páginas registradas por usuarios</Card.Title>
                    <Card.Text>
                      Selecciona un usuario para listar las páginas que tienen registradas.
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
