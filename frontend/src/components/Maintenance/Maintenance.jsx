import { faTools } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Maintenance = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <div
        style={{
          fontSize: "4rem",
          color: "var(--primary-color)",
          marginBottom: "1rem",
        }}
      >
        <FontAwesomeIcon icon={faTools} />
      </div>
      <h1
        style={{
          fontFamily: "Product Sans, sans-serif",
          fontSize: "2rem",
          marginBottom: "0.5rem",
        }}
      >
        ¡Estamos en mantenimiento!
      </h1>
      <p
        style={{
          maxWidth: "500px",
          fontSize: "1rem",
          color: "var(--muted-color)",
        }}
      >
        Lo sentimos, estamos mejorando la web para ofrecerte la mejor experiencia.
        Volveremos muy pronto. Gracias por tu paciencia. 😎
      </p>
      <button
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          fontFamily: "Open Sans, sans-serif",
          backgroundColor: "var(--primary-color)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "var(--box-shadow-soft)",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary-color)")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-color)")}
        onClick={() => window.location.reload()}
      >
        Reintentar
      </button>
    </div>
  );
};

export default Maintenance;
