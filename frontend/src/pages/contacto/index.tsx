import localStyle from './Contacto.module.css';
import Head from 'next/head';
import React, { useEffect, useId, useState, useRef } from 'react';
import AppNavbar from '@/pages/components/AppHeader';
import Inicio from '@/pages/components/Inicio';
import AppFooter from '@/pages/components/AppFooter';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { FaGraduationCap, FaUserGraduate, FaUser, FaTelegramPlane, FaEraser } from 'react-icons/fa';
import { BiPhone, BiEnvelope, BiGlobe, BiAlarm, BiPhoneOff, } from 'react-icons/bi';
import * as yup from 'yup';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { generateApiUrl, API_V1_CONTACTO } from '@/lib/constants';
export default function Contacto() {

  const formId = useId();
  const nombreId = useId();
  const correoId = useId();
  const telefonoId = useId();
  const asuntoId = useId();
  const mensajeId = useId();

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const [validated, setValidated] = useState({ value: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  const contactoSchema = yup.object().shape({
    nombre: yup.string().min(6).max(20).required(),
    email: yup.string().email().min(8).required(),
    telefono: yup.string().min(8).matches(phoneRegExp).required(),
    asunto: yup.string().min(8).required(),
    mensaje: yup.string().required()
  });

  return (
    <>
      <Head>
        <title>Contacto</title>
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />

      <section className='py-3 py-md-5 py-xl-8'>
        <Container>
          <Row className="justify-content-md-center">
            <Col lg='8' md='10' xl='7' xxl='6'>
              <h2 className="mb-4 display-5 text-center">Contacto</h2>
              <p className="text-secondary mb-5 text-center lead fs-4">Este trabajo fue desarrollado en la Escuela Superior de Cómputo del Instituto Politécnico Nacional. Para más información, puede utilizar el formulario a continuación.</p>
              <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="">
            <Col lg='12'>
              <Card className="border border-dark rounded shadow-sm overflow-hidden">
                <Card.Body className="p-0">
                  <Row className="gy-3 gy-md-4 gy-lg-0">
                    <Col lg='6' className={`${localStyle.form_image} bsb-overlay background-position-center background-size-cover form-image`} style={{ backgroundColor: 'gray' }}>
                      <Row className="align-items-lg-center justify-content-center h-100">
                        <Col xl='10' className="col-11">
                          <div className="contact-info-wrapper py-4 py-xl-5">
                            <h2 className="h1 mb-3 text-light">Para más información</h2>
                            <p className="lead fs-4 text-light opacity-75 mb-4 mb-xxl-5">Puede acudir a la ESCOM-IPN, en Subdirección Académica para solicitar más información, o también puede usar el formulario y me pondré en contacto con usted lo más pronto posible.</p>
                            <div className="d-flex mb-4 mb-xxl-5">
                              <div className="me-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-geo" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="mb-3 text-light">Dirección</h4>
                                <address className="mb-0 text-light opacity-75">Av. Juan de Dios Bátiz s/n esq. Av. Miguel Othón de Mendizabal. Colonia Lindavista. Alcaldia Gustavo A. Madero, 07738. CDMX</address>
                              </div>
                            </div>
                            <div className="row mb-4 mb-xxl-5">
                              <div className="col-12 col-xxl-6">
                                <div className="d-flex mb-4 mb-xxl-0">
                                  <div className="me-4 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-telephone-outbound" viewBox="0 0 16 16">
                                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="mb-3 text-light">Teléfono</h4>
                                    <p className="mb-0">
                                      <a className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none" href="tel:+5257296000#52000">(+52) 57296000 ext. 52000</a>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-xxl-6">
                                <div className="d-flex mb-0">
                                  <div className="me-4 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-envelope-at" viewBox="0 0 16 16">
                                      <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                                      <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="mb-3 text-light">E-Mail</h4>
                                    <p className="mb-0">
                                      <a className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none" href="mailto:sub_academica_escom@ipn.mx">sub_academica_escom@ipn.mx</a>
                                    </p>
                                    <p className="mb-0">
                                      <a className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none" href="mailto:lbravol1300@alumno.ipn.mx">lbravol1300@alumno.ipn.mx</a>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="me-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                  <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z" />
                                  <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="mb-3 text-light">Horario</h4>
                                <div className="d-flex mb-1">
                                  <p className="text-light fw-bold mb-0 me-5">Lun - Vie</p>
                                  <p className="text-light opacity-75 mb-0">7am - 9pm</p>
                                </div>
                                <div className="d-flex">
                                  <p className="text-light fw-bold mb-0 me-5">Sab - Dom</p>
                                  <p className="text-light opacity-75 mb-0">9am - 2pm</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg='6'>
                      <div className="row align-items-lg-center h-100">
                        <div className="col-12">
                          <Formik
                            initialValues={{
                              nombre: "",
                              email: "",
                              telefono: "",
                              asunto: "",
                              mensaje: ""
                            }}

                            // Passes your previous Yup schema to your Formik component
                            validationSchema={contactoSchema}

                            /* Use this method to handle what you want to happen when the form is
                               submitted. For this simple example we send an alert to the browser
                               with all the values of each form field, and stop the rest of the
                               submit process from being sent to the back end */
                            onSubmit={async (values, { setSubmitting }) => {
                              setSubmitting(true);
                              setSendingEmail(true);
                              await fetch(generateApiUrl(API_V1_CONTACTO), { credentials: 'include', method: 'POST', body: JSON.stringify(values), headers: { 'content-type': 'application/json' } })
                                .then((respose) => respose.json())
                                .then((respose) => {
                                  alert(respose.data);
                                  setSubmitting(false);
                                  setSendingEmail(false);
                                })
                                .catch(() => {
                                  alert("No fue posible registrar una nueva página");
                                  setSubmitting(false);
                                  setSendingEmail(false);
                                });
                            }}>
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                              <Form noValidate onSubmit={handleSubmit} id={formId}>
                                <Row className="gy-4 gy-xl-5 p-4 p-xl-5">
                                  <Col className="col-12">
                                    <Form.Group className="" controlId={nombreId}>
                                      <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                      <InputGroup hasValidation={true}>
                                        <Form.Control aria-describedby={nombreId} name="nombre" placeholder='...' defaultValue={values.nombre} onChange={handleChange} isInvalid={!!errors.nombre} isValid={touched.nombre && !errors.nombre} />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                          {errors.nombre}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Col>
                                  <Col className="col-12 col-md-6">
                                    <Form.Group className="" controlId={correoId}>
                                      <Form.Label>Correo electrónico <span className="text-danger">*</span></Form.Label>
                                      <InputGroup hasValidation={true}>
                                        <InputGroup.Text id="basic-addon1"><BiEnvelope /></InputGroup.Text>
                                        <Form.Control aria-describedby={correoId} name="email" placeholder='...' defaultValue={values.email} onChange={handleChange} isInvalid={!!errors.email} isValid={touched.email && !errors.email} />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                          {errors.email}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Col>
                                  <Col className="col-12 col-md-6">
                                    <Form.Group className="" controlId={telefonoId}>
                                      <Form.Label>Número de tel. <span className="text-danger">*</span></Form.Label>
                                      <InputGroup hasValidation={true}>
                                        <InputGroup.Text id="basic-addon1"><BiPhone /></InputGroup.Text>
                                        <Form.Control aria-describedby={telefonoId} name="telefono" placeholder='...' defaultValue={values.telefono} onChange={handleChange} isInvalid={!!errors.telefono} isValid={touched.telefono && !errors.telefono} />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                          {errors.telefono}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Col>
                                  <Col className="col-12">
                                    <Form.Group className="" controlId={asuntoId}>
                                      <Form.Label>Asunto <span className="text-danger">*</span></Form.Label>
                                      <InputGroup hasValidation={true}>
                                        <Form.Control aria-describedby={asuntoId} name="asunto" placeholder='...' defaultValue={values.asunto} onChange={handleChange} isInvalid={!!errors.asunto} isValid={touched.asunto && !errors.asunto} />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                          {errors.asunto}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Col>
                                  <Col className="col-12">
                                    <Form.Group className="" controlId={mensajeId}>
                                      <Form.Label>Mensaje <span className="text-danger">*</span></Form.Label>
                                      <InputGroup hasValidation={true}>
                                        <Form.Control as="textarea" rows={3} aria-describedby={mensajeId} name="mensaje" placeholder='...' defaultValue={values.mensaje} onChange={handleChange} isInvalid={!!errors.mensaje} isValid={touched.mensaje && !errors.mensaje} />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                          {errors.mensaje}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Col>
                                  <Col className="col-12">
                                    <div className="d-grid">
                                      <Button className="btn btn-primary btn-lg" type="submit" disabled={!!sendingEmail}>{sendingEmail ? <span><Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true" />&nbsp;Enviando...</span> : <><FaTelegramPlane />{" Enviar mensaje"}</>}</Button>
                                    </div>
                                  </Col>
                                  {/* <Col className="col-4">
                                    <div className="d-grid">
                                      <Button className="btn btn-primary btn-lg" type="reset" disabled={!!sendingEmail}><FaEraser /> {" Reiniciar"}</Button>
                                    </div>
                                  </Col> */}
                                </Row>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <AppFooter />
    </>
  );
}
