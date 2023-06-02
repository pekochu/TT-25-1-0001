import { AuthProvider } from '@/providers/auth/AuthProvider';

import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </AuthProvider>
  );
}
