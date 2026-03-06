import { useAuth } from "../../hooks/useAuth.js";

const IfRole = ({ roles, children }) => {
  const { identity, authStatus } = useAuth();

  if (authStatus !== "authenticated") return null;

  const userRole = identity?.metadata?.role;
  
  return roles.includes(userRole) ? children : null;
};

export default IfRole;
