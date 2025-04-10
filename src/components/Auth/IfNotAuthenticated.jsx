import { useAuth } from "../../hooks/useAuth.js";

const IfNotAuthenticated = ({ children }) => {
  const { authStatus } = useAuth();
  console.log(authStatus);
  return authStatus === "unauthenticated" ? children : null;
};

export default IfNotAuthenticated;
