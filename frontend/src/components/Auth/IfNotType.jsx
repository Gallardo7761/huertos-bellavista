import { useAuth } from "../../hooks/useAuth.js";

const IfNotType = ({ types, children }) => {
  const { identity, authStatus } = useAuth();

  if (authStatus !== "authenticated") return null;

  const userType = identity?.metadata?.type;
  
  return !types.includes(userType) ? children : null;
};

export default IfNotType;
