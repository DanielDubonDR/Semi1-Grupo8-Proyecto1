
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";


const LayoutPrivate = () => {
    const {logueado} = useUserContext();

    return (
        <>
        {logueado ? <Outlet /> : <Navigate to="/" />}
        </>
    )
};

export default LayoutPrivate;