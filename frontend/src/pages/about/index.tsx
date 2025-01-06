import Head from 'next/head';
import Image from 'react-bootstrap/Image';
import AppNavbar from '@/pages/components/AppHeader';
import Inicio from '@/pages/components/Inicio';
import AppFooter from '@/pages/components/AppFooter';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FaGraduationCap, FaUserGraduate, FaUser } from 'react-icons/fa';
export default function About() {
  return (
    <>
      <Head>
        <title>Acerca de</title>
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />

      <section className='py-3 py-md-5'>
        <Container>
          <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
            <div className="col-12 col-lg-6 col-xl-5">
              <Image className="img-fluid rounded" loading="lazy" src="./TT.png" alt="About 1" />
            </div>
            <div className="col-12 col-lg-6 col-xl-7">
              <div className="row justify-content-xl-center">
                <div className="col-12 col-xl-11">
                  <h2 className="mb-3">Acerca de...</h2>
                  <p className="lead fs-4 text-secondary mb-3">Ayudamos a la gente a estar al tanto de las páginas web que son importantes para ellos.</p>
                  <p className="mb-5">Este ha sido un Trabajo Terminal de la Escuela Superior de Cómputo (ESCOM) del Instituto Politécnico Nacional (IPN). TTR con número 25-1-0001.</p>
                  <div className="row gy-4 gy-md-0 gx-xxl-5X">
                    <div className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="me-4 text-primary h2">
                          <FaUserGraduate className='' />
                        </div>
                        <div>
                          <h2 className="h4 mb-3">Alumno</h2>
                          <p className="text-secondary mb-0">Luis Ángel Bravo López</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="me-4 text-primary h2">
                          <FaUser />
                        </div>
                        <div>
                          <h2 className="h4 mb-3">Director</h2>
                          <p className="text-secondary mb-0">M. en D.E. Miguel Ángel Rodríguez Castillo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <AppFooter />
    </>
  );
}
