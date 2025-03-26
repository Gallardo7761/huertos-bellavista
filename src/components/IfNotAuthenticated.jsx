import {useAuth} from "../hooks/useAuth";

const IfNotAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : null;
};

export default IfNotAuthenticated;
