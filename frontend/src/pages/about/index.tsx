import Head from 'next/head';
import Image from 'next/image';
import AppNavbar from '@/pages/components/AppHeader';
import Inicio from '@/pages/components/Inicio';
import AppFooter from '@/pages/components/AppFooter';

export default function Home() {
  return (
    <>
      <Head>
        <title>Acerca de </title>
        <meta name="description" content="NextApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />

      <AppFooter />
    </>
  );
}
