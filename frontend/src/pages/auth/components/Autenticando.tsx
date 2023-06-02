import Container from 'react-bootstrap/Container';
import React from 'react';

export default function AutenticandoComponent() {
  return (
    <>
      <main role="main" className="m-auto col-md-6" style={{ minHeight: '680px' }}>
        <Container>
          <div className="px-4 py-3 my-5 text-center">
            <h1 className="display-5 fw-bold text-body-emphasis">Autenticando credenciales</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">Un momento, por favor...</p>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
