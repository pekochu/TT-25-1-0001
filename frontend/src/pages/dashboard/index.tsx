import Head from 'next/head';
import Image from 'next/image';
import AppNavbar from '@/pages/dashboard/components/AppHeader';
import AdminAppNavbar from '@/pages/dashboard/components/AdminAppHeader';
import AppFooter from '@/pages/components/AppFooter';
import DashboardComponent from '@/pages/dashboard/components/Dashboard';
import AdminDashboardComponent from '@/pages/dashboard/components/AdminDashboard';
import Loading from '@/pages/dashboard/components/Loading';
import { useAuth } from '@/providers/auth/AuthProvider';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import withAuth from '@/util/withAuth';

export const getServerSideProps = (context: GetServerSidePropsContext) =>
  withAuth<{
    timeToRefresh: boolean
  }>(
    context,
    async () => {
      // Checar si es necesario refrescar la sesión
      return {
        props: {
          timeToRefresh: false
        }
      }
    }
  );

export default function Dashboard({
  timeToRefresh,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        {isAuthenticated ?
          <>
            {currentUser.rol === 0 ? (<title>ESCOMONITOR | Panel de Administrador</title>) : (<title>ESCOMONITOR | Panel de Control</title>)}
          </> : <>
            <title>ESCOMONITOR</title>
          </>
        }
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      {isAuthenticated ?
        <>
          {currentUser.rol === 0 ?
            <>
              <AdminAppNavbar /><AdminDashboardComponent />
            </> : <>
              <AppNavbar /><DashboardComponent />
            </>}
        </> : <>
          <Skeleton />
        </>
      }
      <AppFooter />
    </>
  );
}
