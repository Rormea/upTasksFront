import { useState, useEffect, createContext } from 'react'
import clientAxios from '../config/clientAxios';
import { useNavigate } from 'react-router-dom';




const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        //const token = localStorage.getItem('token')
        // en login seteamos el token a localStorage y aqui lo mandamos llamar de localStorage

        const userAuth = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                setLoading(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };


            try {
                const { data } = await clientAxios.get('/users/profile', config)
                // console.log(data)

                setAuth(data)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        };

        userAuth();

    }, []);

    const logOutAuth = () => {
        setAuth({})
    };

    return (

        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                logOutAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
};

export {
    AuthProvider
}

export default AuthContext