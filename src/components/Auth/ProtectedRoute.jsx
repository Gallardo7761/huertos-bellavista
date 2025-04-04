import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuth();

  if (authStatus === "checking") return <FontAwesomeIcon icon={faSpinner} />; // o un loader si quieres
  if (authStatus === "unauthenticated") return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
