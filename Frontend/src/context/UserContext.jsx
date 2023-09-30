import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({children}) =>{
    const user = JSON.parse(localStorage.getItem('data_user'));
    let data_u = false;
    if(user){
        data_u = true;
    }
    const [logueado, setLogueado] = useState(data_u);

    return(
        <UserContext.Provider value ={{logueado, setLogueado}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;

export const useUserContext = () => useContext(UserContext)