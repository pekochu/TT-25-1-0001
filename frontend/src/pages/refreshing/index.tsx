import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth/AuthProvider';
import { useEffect } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import RenovandoComponent from '@/pages/refreshing/components/Renovando';
import LoginErrorComponent from '@/pages/refreshing/components/LoginError';
import { generateApiUrl, API_AUTH } from '@/lib/constants';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  if (!context.query.token) {
    return {
      props: {
        userAuthenticated: { success: false },
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
            userAuthenticated: { success: false },
          },
        };
      });
  }
};


export default function RefreshingPage({
  userAuthenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    refreshSession,
    logOut
  } = useAuth();
  const router = useRouter();

  if (!userAuthenticated.success) {
    useEffect(() => {
      refreshSession()
        .then(() => {
          // Redirect to home page
          router.push('/dashboard');
        })
        .catch(err => {
          // Redirect to login
          logOut()
          router.push('/');
        })
    }, []);

    return (
      <>
        <Head>
          <title>Renovando sesión...</title>
          <meta name="description" content="NextApp" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <RenovandoComponent />
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>Token ya no es valido</title>
          <meta name="description" content="NextApp" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </>
    )
  }
};