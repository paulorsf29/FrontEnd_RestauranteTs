import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type RotaProtegidaProps = {
    children: React.ReactNode;
    cargoPermitidos: string[];
};

export default function RotaProtegida({ children, cargoPermitidos}: RotaProtegidaProps) {
    const { user} = useAuth();

    if (!user){
        return <Navigate to="/login" replace />;
    }
    if (!cargoPermitidos.includes(user.role)) {
        return <Navigate to="/NaoAutorizado" replace />;
    }
    return <>{children}</>;
}
