import { AuthProvider } from '@/providers/auth/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (<AuthProvider><Component {...pageProps} /></AuthProvider>);
}
