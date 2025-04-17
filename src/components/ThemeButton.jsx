import { useTheme } from "../hooks/useTheme.js";
import "../css/ThemeButton.css";

export default function ThemeButton({ className}) {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <button className={`theme-toggle ${className}`} onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Modo claro" : "🌛 Modo oscuro"}
        </button>
    );
}