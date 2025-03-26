import '../css/Header.css';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

const Header = () => {
    const { theme } = useTheme();

    return (
        <header className={`text-center bg-img ${theme}`}>
            <div className="m-0 p-5 mask">
                <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <Link to='/' className='text-decoration-none'>
                        <h1 className='header-title m-0 text-white shadowed'>Asociación Huertos La Salud - Bellavista</h1>
                    </Link>
                    <h4 className='bg-dark rounded-3 m-0 mt-3 p-2 col-6 text-danger'>🚧 Esto es un mockup, próximamente estará disponible la web entera 🚧</h4>
                </div>
            </div>
        </header>
    );
}

export default Header;