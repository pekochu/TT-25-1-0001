import Container from 'react-bootstrap/Container';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VerificandoComponent() {
  const router = useRouter();
  useEffect(() => {
    router.push('/')
  });

  return (
    <>
      <main role="main" className="m-auto col-md-6" style={{ minHeight: '680px' }}>
        <Container>
          <div className="px-4 py-3 my-5 text-center">
            <h1 className="display-5 fw-bold text-body-emphasis">Correo enviado</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">Por favor, revisa tu correo electrónico. Se te ha enviado un link mágico para poder iniciar sesión sin contraseña.</p>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
