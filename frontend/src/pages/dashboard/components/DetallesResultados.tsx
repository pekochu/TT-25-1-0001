import 'react-image-crop/dist/ReactCrop.css'
import 'react-loading-skeleton/dist/skeleton.css'

import moment from 'moment';
import { diffLines } from 'diff';
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
import Cookies from 'universal-cookie';
import React, { useEffect, useId, useState } from 'react';
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiSearch, FiStopCircle, FiTrash } from 'react-icons/fi';
import ReactCrop from 'react-image-crop'
import { generateApiUrl, API_WEB_SCREENSHOT_URL } from '@/lib/constants';
moment.locale('es-mx');

interface IDetallesResultadosProps {
  resultado: any
  pagina: any
  show: boolean
  setShow: (_show: boolean) => void
}
export default function DetallesResultadosModal({ resultado, pagina, show, setShow }: IDetallesResultadosProps) {

  const urlId = useId();
  const imgId = useId();
  const newImgId = useId();
  const diffImgId = useId();
  const frecuenciaId = useId();
  const descripcionId = useId();
  const diferenciaId = useId();

  const [validated, setValidated] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [baseScreenshotLoading, setBaseScreenshotLoading] = useState(false);
  const [newScreenshotLoading, setNewScreenshotLoading] = useState(false);
  const [differenceScreenshotLoading, setDifferenceScreenshotLoading] = useState(false);
  const [verticalOverflow, setVerticalOverflow] = useState(false);
  const [img, setImg] = useState('/imagen foto navegador.png');
  const [newImg, setNewImg] = useState('/imagen foto navegador.png');
  const [diffImg, setDiffImg] = useState('/imagen foto navegador.png');
  const [baseText, setBaseText] = useState('');
  const [diffText, setDiffText] = useState('');

  const getSnapshots = async () => {
    setVerticalOverflow(false);
    setBaseScreenshotLoading(true);
    setNewScreenshotLoading(true);
    setDifferenceScreenshotLoading(true);
    // Cargar imagen base
    const baseRes = await fetch(generateApiUrl(`/api/v1/results/${resultado.id}/getBaseImage`), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${new Cookies().get('token')}`
      },
    });
    const baseImageBlob = await baseRes.blob();
    const baseImageObjectURL = URL.createObjectURL(baseImageBlob);
    setImg(baseImageObjectURL);
    setBaseScreenshotLoading(false);
    // Cargar nueva imagen
    const newRes = await fetch(generateApiUrl(`/api/v1/results/${resultado.id}/getNewImage`), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${new Cookies().get('token')}`
      },
    });
    const newImageBlob = await newRes.blob();
    const newImageObjectURL = URL.createObjectURL(newImageBlob);
    setNewImg(newImageObjectURL);
    setNewScreenshotLoading(false);
    // Cargar imagen de diferencia
    const differenceRes = await fetch(generateApiUrl(`/api/v1/results/${resultado.id}/getDifferenceImage`), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${new Cookies().get('token')}`
      },
    });
    const differenceImageBlob = await differenceRes.blob();
    const differenceImageObjectURL = URL.createObjectURL(differenceImageBlob);
    setDiffImg(differenceImageObjectURL);
    setDifferenceScreenshotLoading(false);
  };

  const getTexts = async () => {
    setBaseText(pagina.texto_analisis);
    const diffResult = diffLines(pagina.texto_analisis, resultado.nuevo_texto);
    let stringBuilder = '';
    for (let i = 0; i < diffResult.length; i++) {

      if (diffResult[i].added && diffResult[i + 1] && diffResult[i + 1].removed) {
        let swap = diffResult[i];
        diffResult[i] = diffResult[i + 1];
        diffResult[i + 1] = swap;
      }

      if (diffResult[i].removed) {
        stringBuilder = `${stringBuilder}<del style="text-decoration: none;color: #b30000;background: #fadad7;">${diffResult[i].value}</del>`;
      } else if (diffResult[i].added) {
        stringBuilder = `${stringBuilder}<ins style="background: #eaf2c2;color: #406619;text-decoration: none;">${diffResult[i].value}</ins>`;
      } else {
        stringBuilder = `${stringBuilder}${diffResult[i].value}`;
      }

    }
    setDiffText(stringBuilder);
  }

  console.log(resultado);
  return (
    <>
      {resultado ? (
        <Modal show={show} size="xl" onEntered={pagina.modo.toLowerCase() === 'visual' ? getSnapshots : getTexts} >
          <Modal.Header closeButton onClick={() => setShow(false)} >
            <Modal.Title>Reporte de resultados</Modal.Title>
            {/* <h3>{resultado.uuid}</h3> */}
          </Modal.Header>
          <Modal.Body>
            <Container fluid>
              <div className="py-1 my-1 overflow-y-auto" style={{ height: '100%', width: '100%' }} >
                <Row>
                  <Col lg='12'>
                    <Card className='mb-2'>
                      <Card.Header>Resultados de Monitoreo</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <ul><li>Hora de monitoreo: {moment(resultado.tiempoChequeo).format('DD/MM/YYYY [a las] h:mm:ss a')}</li></ul>
                          <ul><li>Porcentaje de diferencia: {resultado.diferencia}%</li></ul>
                          <ul><li>Tiempo de ejecución: {(new Date(resultado.updatedAt).getTime() - new Date(resultado.tiempoChequeo).getTime()) / 1000} segundos</li></ul>
                        </Card.Text>
                        {/* <Button className="p-2 ms-auto" variant="success" type='submit' disabled={userDataLoading}>
                          {userDataLoading ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          /> : null}
                          Configurar imagen central como nueva imagen base
                        </Button>{' '} */}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                {pagina.modo.toLowerCase() === 'visual' ? <>
                  <Row key={resultado.id}>
                    <Col lg='4'>
                      <Card className=''>
                        <Card.Header as="h5">Imagen base</Card.Header>
                        <Card.Body className='p-0'>
                        </Card.Body>
                        {baseScreenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                          <Card.Img variant="bottom" id={imgId} src={img} />
                        }
                      </Card>
                    </Col>
                    <Col lg='4'>
                      <Card className=''>
                        <Card.Header as="h5">Imagen nueva</Card.Header>
                        <Card.Body className='p-0'>
                        </Card.Body>
                        {newScreenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                          <Card.Img variant="bottom" id={newImgId} src={newImg} />
                        }
                      </Card>
                    </Col>
                    <Col lg='4'>
                      <Card className=''>
                        <Card.Header as="h5">Comparación</Card.Header>
                        <Card.Body className='p-0'>
                        </Card.Body>
                        {differenceScreenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                          <Card.Img variant="bottom" id={diffImgId} src={diffImg} />
                        }
                      </Card>
                    </Col>
                  </Row>
                </> : <>
                  <Row key={resultado.id}>
                    <Col lg='4'>
                      <Card className=''>
                        <Card.Header as="h5">Texto base</Card.Header>
                        <Card.Body >
                          <pre style={{ whiteSpace: 'pre-wrap' }} >{baseText}</pre>
                        </Card.Body>

                      </Card>
                    </Col>
                    <Col lg='4'>
                      <Card className=''>
                        <Card.Header as="h5">Texto nuevo</Card.Header>
                        <Card.Body >
                          <pre style={{ whiteSpace: 'pre-wrap' }} >{resultado.nuevo_texto}</pre>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg='4'>
                      <Card className=''>
                        <Card.Header as="h5">Comparación</Card.Header>
                        <Card.Body >
                          <pre dangerouslySetInnerHTML={{ __html: diffText }} style={{ whiteSpace: 'pre-wrap' }} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>}

              </div>
            </Container>
          </Modal.Body>
          <Modal.Footer>



          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={show} size="xl">
          <Modal.Header closeButton onClick={() => setShow(false)} >
            <Modal.Title>Error al cargar resultados</Modal.Title>
          </Modal.Header>
          <Modal.Body>

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
      )}
    </>
  );
}