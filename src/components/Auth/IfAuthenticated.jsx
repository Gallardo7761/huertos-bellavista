import {useAuth} from "../../hooks/useAuth.js";

const IfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : null;
};

export default IfAuthenticated;
