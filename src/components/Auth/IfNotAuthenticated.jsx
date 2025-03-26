import {useAuth} from "../../hooks/useAuth.js";

const IfNotAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : null;
};

export default IfNotAuthenticated;
