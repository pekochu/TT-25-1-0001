import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth/AuthProvider';
import { useEffect } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import AutenticandoComponent from '@/pages/auth/components/Autenticando';
import LoginErrorComponent from '@/pages/auth/components/LoginError';
import { generateApiUrl, API_AUTH } from '@/lib/constants';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  if (!context.query.token) {
    return {
      props: {
        userAuthenticated: undefined,
      },
    };
  } else {
    const token = context.query.token as string;
    return fetch(generateApiUrl(API_AUTH), { method: 'POST', body: JSON.stringify({ token }), headers: { 'content-type': 'application/json' } })
      .then((respose) => respose.json())
      .then((response) => {
        return {
          props: {
            userAuthenticated: response
          }
        }
      })
      .catch(() => {
        return {
          props: {
            userAuthenticated: undefined,
          },
        };
      });
  }
};


export default function AuthPage({
  userAuthenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    validateTwoFactorAuth,
  } = useAuth();
  const router = useRouter();

  if (userAuthenticated && userAuthenticated.success) {
    useEffect(() => {
      validateTwoFactorAuth(userAuthenticated)
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
          <title>Autenticando...</title>
          <meta name="description" content="NextApp" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AutenticandoComponent />
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>Ha ocurrido un error iniciado sesión</title>
          <meta name="description" content="NextApp" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <LoginErrorComponent />
      </>
    )
  }
};