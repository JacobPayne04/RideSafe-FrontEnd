import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user } = useAuth();

    if(!user) return <Navigate to="/" />

    if(roles.length > 0 && !roles.includes(user.role)){
        return <Navigate to="/" />
    }

    return children;
}

export default ProtectedRoute;