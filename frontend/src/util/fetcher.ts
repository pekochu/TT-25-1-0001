import Cookies from 'universal-cookie';
import { generateApiUrl, API_LOGIN_REFRESH } from '@/lib/constants';

/**
 * Fetcher is a wrapper around fetch that adds the necessary headers and handles token refresh
 * @param url The url to fetch
 * @param isRetrying Whether this is a retry after a token refresh
 * @returns The response from the fetch
 */
const fetcher = <T>(url: string, isRetrying = false): Promise<T> =>
  fetch(url, { credentials: 'include', method: 'GET', headers: { 'content-type': 'application/json', 'authorization': `Bearer ${new Cookies().get('token')}` } })
    .then(async res => {
      // Check if response is ok
      if (res.status == 401 || res.status == 403) {
        // If not, check if we are already retrying
        if (isRetrying) {
          throw new Error('Unable to refresh token');
        }

        // Access refresh token via local storage
        const refreshToken = localStorage.getItem('refreshToken');

        // Token expired, refresh it and retry the request using recursion
        return fetch(generateApiUrl(API_LOGIN_REFRESH), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        })
          .then(refreshRes => refreshRes.json() as Promise<any>)
          .then(refreshRes => {
            if (refreshRes.success && refreshRes.data) {
              // Update the new access token in cookies
              const cookie = new Cookies();
              cookie.set('token', refreshRes.data.accessToken);

              // Retry the request
              return fetcher<T>(url, true);
            } else {
              throw new Error('Unable to refresh token');
            }
          })
      } else if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json() as Promise<T>;
      }
    })
    .catch(err => {
      throw new Error(err);
    })

export default fetcher;