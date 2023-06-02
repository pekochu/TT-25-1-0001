import Head from 'next/head';
import Image from 'next/image';
import AppNavbar from '@/pages/components/AppHeader';
import LoginComponent from '@/pages/login/components/Login';
import AppFooter from '@/pages/components/AppFooter';

export default function Login() {
  return (
    <>
      <Head>
        <title>Inicia sesión</title>
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />
      <LoginComponent />
      <AppFooter />
    </>
  );
}
