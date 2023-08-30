import { useState, createContext, useEffect } from 'react'
import clientAxios from '../config/clientAxios';
import { useNavigate } from 'react-router-dom'





const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {


    const [projects, setProjects] = useState([]);
    const [alert, setAlert] = useState({})
    const navigate = useNavigate();

    useEffect(() => {

        const getProject = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await clientAxios.get('/projects', config);

                setProjects(data)

            } catch (error) {
                console.log(error)
            }
        };

        getProject();
    });



    const showAlert = (alert) => {
        setAlert(alert);

        setTimeout(() => {
            setAlert({});
        }, 3000)
    };

    const submitProject = async project => {

        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            // const { data } = await clientAxios.post('/projects', project, config);
            // console.log(data);
            await clientAxios.post('/projects', project, config);
            showAlert({
                msg: "Proyecto Creado Correctamente",
                error: false
            })

        } catch (error) {
            console.log(error)
        }
    };



    return (

        <ProyectosContext.Provider

            value={{
                projects,
                showAlert,
                alert,
                submitProject,
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext