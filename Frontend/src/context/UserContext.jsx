import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({children}) =>{
    const [logueado, setLogueado] = useState(false);
    return(
        <UserContext.Provider value ={{logueado, setLogueado}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;

export const useUserContext = () => useContext(UserContext)