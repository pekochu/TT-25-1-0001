import Container from 'react-bootstrap/Container';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Footer() {
    return (
        <>
            <footer className="py-3 my-4">
                <p className="text-center text-body-secondary">© 2023 ESCOM, IPN</p>
            </footer>
        </>
    );
}
