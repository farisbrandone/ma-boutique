import React from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  //const location = useLocation();

  /*  if (!isAuthenticated) {
    return (
      <div>
        {" "}
         <Navigate to="/login" state={{ from: location }} replace />; 
      </div>
    );
  } */

  return <>{children}</>;
};

export default ProtectedRoute;
