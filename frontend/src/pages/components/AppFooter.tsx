import Container from 'react-bootstrap/Container';
import moment from 'moment';

export default function Footer() {
    const year = moment().format('YYYY');
    return (
        <>
            <footer className="py-3 my-4">
                <p className="text-center text-body-secondary">©{year}  ESCOM, IPN</p>
            </footer>
        </>
    );
}
