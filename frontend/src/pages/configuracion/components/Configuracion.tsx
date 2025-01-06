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
import Spinner from 'react-bootstrap/Spinner';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { useEffect, useId, useState } from 'react';
import Cookies from 'universal-cookie';
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiSearch, FiSettings, FiStopCircle, FiTrash } from 'react-icons/fi';
import { generateApiUrl, API_WEB_SCREENSHOT_URL, API_V1_PAGES, API_CURRENT_USER, API_CREATE_USER_URL } from '@/lib/constants';

interface IConfiguracionProps {
  currentUser: any
}
export default function ConfiguracionComponent({ currentUser }: IConfiguracionProps) {

  const emailId = useId();
  const telefonoId = useId();


  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [userDataLoading, setUserDataLoading] = useState(false)

  if (typeof currentUser !== 'undefined') {
    setEmail(currentUser.email)
  }

  const actualizar = async (event: any) => {
    event.preventDefault();
    setUserDataLoading(true);

    const resultActions = await fetch(generateApiUrl(API_CREATE_USER_URL), { credentials: 'include', method: 'PATCH', body: JSON.stringify({ telefono: telefono, email: email }), headers: { 'content-type': 'application/json' } });
    setUserDataLoading(false);
  };

  return (
    <>
      <style global jsx>{`
        main .dropdown-toggle::after {
          display: none !important;
        }
      `}</style>
      <main role="main" className="m-4" style={{ minHeight: '680px' }} onLoad={(e) => { console.log('loaded') }}>
        <Container>
          <div className="px-4 py-3 my-5 text-center">
            <h1 className="display-5 fw-bold text-body-emphasis">Sistema Monitor Web</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">Configuración de perfil</p>
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

                </div>
              </div>
              <div className="py-3 my-3">
                <Form onSubmit={(e) => { actualizar(e) }}>
                  <div className="col-lg-9 mx-auto row">
                    <div className="col-lg-6">
                      <Form.Group className="mb-3" controlId={emailId}>
                        <Form.Label>Correo electrónico</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control aria-describedby={emailId} name="email" placeholder='ejemplo@gmail.com' required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-lg-6">
                      <Form.Group className="mb-3" controlId={telefonoId}>
                        <Form.Label>Núm. de teléfono</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control aria-describedby={telefonoId} name="telefono" placeholder='5512345678' required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="col-lg-9 mx-auto row">
                    <div className="col-lg-6">
                      <Button variant="primary" type='submit' disabled={userDataLoading}>
                        {userDataLoading ? <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> : null}
                        Guardar datos
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Card.Body>
          </Card>

        </Container>
      </main >
    </>
  );
}
