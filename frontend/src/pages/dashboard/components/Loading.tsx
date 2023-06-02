import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

export default function Footer() {
  return (
    <>
      <main role="main" className="container mt-5">
        <Container>
          <div className="text-center">
            <div className="m-auto">
              <Spinner className='spinner-grow' role='status'>

              </Spinner>
            </div>
          </div>
        </Container>
      </main>

    </>
  );
}
