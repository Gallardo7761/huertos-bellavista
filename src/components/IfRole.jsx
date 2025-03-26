import {useAuth} from "../hooks/useAuth";

const IfRole = ({ roles, children }) => {
    const { user } = useAuth();
    return roles.includes(user?.rol) ? children : null;
};

export default IfRole;