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
import Alert from 'react-bootstrap/Alert';
import React, { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/providers/auth/AuthProvider';

export default function Login() {

  const [validated, setValidated] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [useToast, setUseToast] = useState(false);
  const [useToastMsg, setUseToastMsg] = useState(['Error', 'Error al iniciar sesión']);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { logIn } = useAuth();

  const onSubmit = async (data: any) => {
    await logIn(data)
      .then(() => {
        // Redirect to home page
        router.push('/two-factor')
      })
      .catch(err => {
        setUseToast(true);
      })
  }

  const toggleToast = () => setUseToast(!useToast);

  return (
    <>
      <main role="main" className="m-auto col-md-6" style={{ minHeight: '680px' }}>
        <Container>
          <div className="px-4 py-3 my-5 text-center">
            <h1 className="display-5 fw-bold text-body-emphasis">Inicia sesión</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">Enviaremos un link mágico para que puedas autenticarte sin necesidad de contraseñas.</p>
            </div>
          </div>
        </Container>
        <div className="divider" />
        <Container>
          <Card>
            <Card.Body>
              <div className="py-1 my-1">
                <div className="col-lg-9 mx-auto">
                  <div className="col-lg-9 mx-auto">
                    <Alert show={useToast} variant="danger" onClose={toggleToast} dismissible>
                      <Alert.Heading>{useToastMsg[0]}</Alert.Heading>
                      <p>
                        {useToastMsg[1]}
                      </p>
                    </Alert>
                  </div>
                </div>
                <div className="col-lg-9 mx-auto">
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-lg-9 mx-auto">
                      <div>
                        <Form.Group className="mb-3" controlId="email">
                          <Form.Label>Correo electrónico</Form.Label>
                          <InputGroup className="mb-3">
                            <Form.Control aria-describedby="email" {...register('email', { required: true })} placeholder='ejemplo@gmail.com' />
                            {errors.email && <div className="invalid-feedback" style={{ display: 'unset' }}>Por favor, introduce tu correo</div>}
                          </InputGroup>
                        </Form.Group>
                      </div>
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
                          Inicia sesión
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>
    </>
  );
}
