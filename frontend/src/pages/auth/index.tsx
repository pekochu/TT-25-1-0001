import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth/AuthProvider';
import { useEffect } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  return {
    props: { token: context.query?.token ?? undefined }, // will be passed to the page component as props
  };
}


export default function AuthPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    validateTwoFactorAuth,
  } = useAuth();
  const router = useRouter();

  if (token) {
    useEffect(() => {
      validateTwoFactorAuth({ token })
        .then(() => {
          // Redirect to home page
          router.push('/dashboard');
        })
        .catch(err => {
          // Redirect to login
          router.push('/login?error=Token invalido');
        })
    }, []);

    return (
      <>
        <Head>
          <meta name="description" content="NextApp" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </>
    )
  } else {
    useEffect(() => {
      router.push('/login?error=No token');
    }, []);

    return (
      <>
        <Head>
          <meta name="description" content="NextApp" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </>
    )
  }
};