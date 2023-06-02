import Container from 'react-bootstrap/Container';
import React from 'react';

export default function ServerErrorComponent() {
  return (
    <>
      <main role="main" className="m-auto col-md-6" style={{ minHeight: '680px' }}>
        <Container>
          <div className="px-4 py-3 my-5 text-center">
            <h1 className="display-5 fw-bold text-body-emphasis">Error al iniciar sesión</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">Respuesta invalida desde el servidor.</p>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
