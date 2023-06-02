import Head from 'next/head';
import { redirect } from 'next/navigation';
import AppNavbar from '@/pages/components/AppHeader';
import Inicio from '@/pages/components/Inicio';
import AppFooter from '@/pages/components/AppFooter';
import { useAuth } from '@/providers/auth/AuthProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function HomePage() {
  const {
    currentUser,
    logOut,
    refreshSession,
    isAuthenticated,
    accessToken,
    refreshToken,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <>
      <Head>
        <title>Sistema Monitor Web</title>
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />
      <Inicio />
      <AppFooter />
    </>
  );
}
