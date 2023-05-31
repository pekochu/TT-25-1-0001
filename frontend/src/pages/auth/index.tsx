import Head from 'next/head';
import Image from 'next/image';
import AppNavbar from '@/pages/components/AppHeader';
import Login from '@/pages/login/components/Login';
import AppFooter from '@/pages/components/AppFooter';

export default function Home() {
  return (
    <>
      <Head>
        <title>Inicia sesión</title>
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />
      <Login />
      <AppFooter />
    </>
  );
}
