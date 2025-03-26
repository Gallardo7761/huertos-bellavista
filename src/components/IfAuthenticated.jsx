import {useAuth} from "../hooks/useAuth";

const IfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : null;
};

export default IfAuthenticated;
