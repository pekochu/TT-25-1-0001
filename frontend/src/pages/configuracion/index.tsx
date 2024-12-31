import Head from 'next/head';
import Image from 'next/image';
import AppNavbar from '@/pages/dashboard/components/AppHeader';
import AdminAppNavbar from '@/pages/dashboard/components/AdminAppHeader';
import AppFooter from '@/pages/components/AppFooter';
import ConfiguracionComponent from '@/pages/configuracion/components/Configuracion';
import Loading from '@/pages/dashboard/components/Loading';
import { useAuth } from '@/providers/auth/AuthProvider';
import { useEffect } from 'react';
import Cookies from 'universal-cookie';
import Skeleton from 'react-loading-skeleton';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { generateApiUrl, API_WEB_SCREENSHOT_URL, API_V1_PAGES, API_CURRENT_USER } from '@/lib/constants';

export default function Configuracion() {
  const {
    currentUser,
    logOut,
    refreshSession,
    isAuthenticated,
    accessToken,
    refreshToken,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
  }, [isAuthenticated]);

  return (
    <>
      <Head>
        <title>ESCOMONITOR | Configuración</title>
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      {isAuthenticated ?
        <>
          {currentUser.rol === 0 ?
            <>
              <AdminAppNavbar /><ConfiguracionComponent currentUser={currentUser} />
            </> : <>
              <AppNavbar /><ConfiguracionComponent currentUser={currentUser} />
            </>}
        </> : <>
          <Skeleton />
        </>
      }
      <AppFooter />
    </>
  );
}
