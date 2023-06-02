import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { generateApiUrl, API_CURRENT_USER } from '@/lib/constants';
import Cookies from 'universal-cookie';

const redirectToLogin = {
  redirect: {
    destination: '/login',
    permanent: false,
  },
}

// Create a getServerSideProps utility function called "withAuth" to check user
const withAuth = async <T extends Object = any>(
  { req }: GetServerSidePropsContext,
  onSuccess: () => Promise<GetServerSidePropsResult<T>>
): Promise<GetServerSidePropsResult<T>> => {
  const cookies = new Cookies(req.cookies);
  // Get the user's session based on the request
  if (req.cookies.token) {
    // Get token from cookie
    const token = cookies.get('token');

    return fetch(generateApiUrl(API_CURRENT_USER), { method: 'POST', body: JSON.stringify({ token }), headers: { 'content-type': 'application/json' } })
      .then((respose) => respose.json())
      .then((response) => {
        if(!!response.success){
          return onSuccess();
        }
        
        return redirectToLogin;
      })
      .catch(() => {
        return redirectToLogin;
      });
  } else {
    return redirectToLogin;
  }
}

export default withAuth;