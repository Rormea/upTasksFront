import { useState, createContext, useEffect } from 'react'
import clientAxios from '../config/clientAxios';
import { useNavigate } from 'react-router-dom'





const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {


    const [projects, setProjects] = useState([]);
    const [projetAlone, setProjetAlone] = useState({})
    const [alert, setAlert] = useState({})
    const [loading, setLoading] = useState(false)



    // const navigate = useNavigate();


    // cuando cargue este component va a traer la data de todos los proyects 
    useEffect(() => {

        const getAllProjectShow = async () => {
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

        getAllProjectShow();
    });



    const showAlert = (alert) => {
        setAlert(alert);

        setTimeout(() => {
            setAlert({});
        }, 3000)
    };


    // Submit
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

    /// Obtener proyecto por id

    const getProject = async (id) => {

        setLoading(true);
        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clientAxios.get(`/projects/${id}`, config);
            setProjetAlone(data)


        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };


    return (

        <ProyectosContext.Provider

            value={{
                projects,
                projetAlone,
                showAlert,
                alert,
                submitProject,
                getProject,
                loading
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