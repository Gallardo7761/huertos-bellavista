import { useEffect, useState } from "react";
import { parseJwt } from "../util/tokenUtils.js";
import NotificationModal from "../components/NotificationModal.jsx";
import axios from "axios";
import { useAuth } from "./useAuth.js";
import { useConfig } from "./useConfig.js";

const useSessionRenewal = () => {
  const { logout } = useAuth();
  const { config } = useConfig();

  const [showModal, setShowModal] = useState(false);
  const [alreadyWarned, setAlreadyWarned] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded?.exp) return;

    const expirationTime = decoded.exp * 1000;
    const now = Date.now();
    const warningTime = expirationTime - now - 60000;

    if (warningTime > 0 && !alreadyWarned) {
      const warningTimeout = setTimeout(() => {
        setShowModal(true);
        setAlreadyWarned(true);
      }, warningTime);

      const logoutTimeout = setTimeout(() => {
        logout();
      }, expirationTime - now);

      return () => {
        clearTimeout(warningTimeout);
        clearTimeout(logoutTimeout);
      };
    }
  }, [alreadyWarned, config, logout]);

  const handleRenew = async () => {
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const now = Date.now();
    const expTime = decoded?.exp * 1000;

    if (!token || !decoded || now > expTime) {
      logout();
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.auth.refresh}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newToken = response.data.data.token;
      localStorage.setItem("token", newToken);
      setShowModal(false);
      setAlreadyWarned(false);
    } catch (err) {
      console.error("Error renovando sesión:", err);
      logout();
    }
  };

  const modal = showModal && (
    <NotificationModal
      show={true}
      onClose={() => {
        setShowModal(false);
        logout();
      }}
      title="¿Quieres seguir conectado?"
      message="Tu sesión está a punto de expirar. ¿Quieres renovarla 1 hora más?"
      variant="info"
      buttons={[
        {
          label: "Renovar sesión",
          variant: "success",
          onClick: handleRenew,
        },
        {
          label: "Cerrar sesión",
          variant: "danger",
          onClick: () => {
            logout();
            setShowModal(false);
          },
        },
      ]}
    />
  );

  return { modal };
};

export default useSessionRenewal;