import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if(loading) return <div>Loading...</div>;
    
    if(!user) return <Navigate to="/" />

    if(roles.length > 0 && !roles.includes(user.role)){
        return <Navigate to="/" />
    }

    return children;
}

export default ProtectedRoute;