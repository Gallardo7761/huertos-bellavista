import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../context/ThemeContext.jsx";
import "../css/ThemeButton.css";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

/**
 * ThemeButton.jsx
 * 
 * Este archivo define el componente ThemeButton, que permite a los usuarios cambiar entre temas claro y oscuro.
 * 
 * Importaciones:
 * - useTheme: Hook personalizado para acceder al contexto del tema.
 * - "../css/ThemeButton.css": Archivo CSS que contiene los estilos para el botón de cambio de tema.
 * 
 * Funcionalidad:
 * - ThemeButton: Componente que renderiza un botón para alternar entre temas claro y oscuro.
 *   - Utiliza el hook `useTheme` para acceder al tema actual y la función para cambiarlo.
 *   - El botón muestra un icono de sol (☀️) si el tema actual es oscuro, y un icono de luna (🌙) si el tema actual es claro.
 * 
 */

export default function ThemeButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
            {theme === "dark" ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
        </button>
    );
}