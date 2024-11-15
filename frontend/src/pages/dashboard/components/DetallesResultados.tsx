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
import Cookies from 'universal-cookie';
import React, { useEffect, useId, useState } from 'react';
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiSearch, FiStopCircle, FiTrash } from 'react-icons/fi';
import ReactCrop from 'react-image-crop'
import { generateApiUrl, API_SCREENSHOT_URL } from '@/lib/constants';


interface IDetallesResultadosProps {
  resultado: any
  show: boolean
  setShow: (_show: boolean) => void
}
export default function DetallesResultadosModal({ resultado, show, setShow }: IDetallesResultadosProps) {

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

  const getSnapshots = async () => {
    setVerticalOverflow(false);
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
  };


  return (
    <>
      {resultado ? (
        <Modal show={show} size="xl" onEntered={getSnapshots} >
          <Modal.Header closeButton onClick={() => setShow(false)} >
            <Modal.Title>Detalles de resultados: {resultado.uuid}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container fluid>
              <div className="py-1 my-1 overflow-y-auto" style={{ height: '100%', width: '100%' }} >
                <Row>
                  <Col lg='4'>
                    <Card className=''>
                      <Card.Body className='p-0'>
                        <div className='flex flex-1 rounded overflow-auto' style={{ height: verticalOverflow ? "28rem" : "auto" }} >
                          <div className='relative'>
                            {baseScreenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                              <Image id={imgId} rounded={true} src={img} style={{ maxWidth: "100%", height: "auto" }} />}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg='4'>
                    <Card className=''>
                      <Card.Body className='p-0'>
                        <div className='flex flex-1 rounded overflow-auto' style={{ height: verticalOverflow ? "28rem" : "auto" }} >
                          <div className='relative'>
                            {baseScreenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                              <Image id={newImgId} rounded={true} src={newImg} style={{ maxWidth: "100%", height: "auto" }} />}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg='4'>
                    <Card className=''>
                      <Card.Body className='p-0'>
                        <div className='flex flex-1 rounded overflow-auto' style={{ height: verticalOverflow ? "28rem" : "auto" }} >
                          <div className='relative'>
                            {baseScreenshotLoading ? <Skeleton style={{ height: "26rem" }} /> :
                              <Image id={diffImgId} rounded={true} src={diffImg} style={{ maxWidth: "100%", height: "auto" }} />}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button className="p-2 ms-auto" variant="success" type='submit' disabled={userDataLoading}>
              {userDataLoading ? <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> : null}
              Configurar imagen central como nueva imagen base
            </Button>{' '}


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
