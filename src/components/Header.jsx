import '../css/Header.css';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { theme } = useTheme();

    return (
        <header className={`text-center bg-img ${theme}`}>
            <div className="m-0 p-5 mask">
                <div className="d-flex justify-content-center align-items-center h-100">
                    <Link to='/' className='text-decoration-none'>
                        <h1 className='header-title m-0 text-white shadowed'>Asociación Huertos La Salud - Bellavista</h1>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;