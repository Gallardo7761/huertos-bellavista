import { useTheme } from "../context/useTheme.js";
import "../css/ThemeButton.css";

export default function ThemeButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌛"}
        </button>
    );
}