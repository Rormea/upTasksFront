import { useState, createContext, useEffect } from 'react'
import clientAxios from '../config/clientAxios';
import { useNavigate } from 'react-router-dom'





const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {


    const [projects, setProjects] = useState([]);
    const [projetAlone, setProjetAlone] = useState({})
    const [alert, setAlert] = useState({})
    const [loading, setLoading] = useState(false)
    const [modalFormTask, setModalFormTask] = useState(false)
    const [taskPro, setTaskPro] = useState({})



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

        // if (project.paramsId) {
        //     updatingProject(project);
        // } else {
        //     newProject(project);
        // }
        // return

        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };


            if (project.paramsId) {
                const { data } = await clientAxios.put(`/projects/${project.paramsId}`, project, config);
                setProjects([...projects, data]);
            } else {
                const { data } = await clientAxios.post('/projects', project, config);
                setProjects([...projects, data]);
            }


            showAlert({
                msg: project.paramsId ? 'Proyecto Actualizado Correctamente' : 'Proyecto Creado Correctamente',

                error: false
            })

        } catch (error) {
            console.log(error)
        }


    };


    // const updatingProject = async (project) => {

    // try {

    //     const token = localStorage.getItem('token');
    //     if (!token) return

    //     const config = {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`
    //         }
    //     };

    //     const { data } = await clientAxios.put(`/projects/${project.paramsId}`, project, config);
    //     console.log(data);
    //     setProjects([...projects, data]);


    //     showAlert({
    //         msg: "Proyecto Actualizado Correctamente",
    //         error: false
    //     })

    // } catch (error) {
    //     console.log(error)
    // }
    // };

    // const newProject = async (project) => {

    //     try {

    //         const token = localStorage.getItem('token');
    //         if (!token) return

    //         const config = {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`
    //             }
    //         };

    //         const { data } = await clientAxios.post('/projects', project, config);
    //         console.log(data);
    //         setProjects([...projects, data]);


    //         showAlert({
    //             msg: "Proyecto Creado Correctamente",
    //             error: false
    //         })

    //     } catch (error) {
    //         console.log(error)
    //     }
    // };

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


    // Borrar proyecto

    const deleteProject = async (id) => {

        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clientAxios.delete(`/projects/${id}`, config);
            setProjects([...projects, data]);


            showAlert({
                msg: "Proyecto Eliminado",
                error: false
            })

        } catch (error) {
            console.log(error)
        }
    };


    // Para poder utilizar el Modal en el Global

    const handleModalTask = () => {
        setModalFormTask(!modalFormTask);
        setTaskPro({})
    };

    // Para hacer el submmit de tarea

    const submitTask = async (task) => {

        // setLoading(true);
        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            console.log(!taskPro._id)
            if (!taskPro._id) {
                const { data } = await clientAxios.post(`/tasks`, task, config);
                // actulizar el proyecto con las nuevas tareas
                const tasksInProject = { ...projetAlone }
                tasksInProject.tasks = [...projetAlone.tasks, data]
                setProjetAlone(tasksInProject)
            } else {
                const idTask = taskPro._id
                const { data } = await clientAxios.put(`/tasks/${idTask}`, task, config)
                // console.log(taskPro, idTask, task)
                // console.log(data)
                // console.log(projetAlone)
                const projectWithTaskUpdated = { ...projetAlone }
                // // el objeto proyectoAlone tiene dentro un array que son las tareas
                projectWithTaskUpdated.tasks = projectWithTaskUpdated.tasks.map(el => el._id === data._id ? data : el)
                // console.log(projectWithTaskUpdated)
                // em map dice que va iterar por ese arreglo de tareas dentro del proyecto, si el id es el mismo va chancar los datos
                // con la nueva data y si no es igual simplmente va dejar la tarea tal cual
                setProjetAlone(projectWithTaskUpdated)

            }

            setAlert({})
            setModalFormTask(false);

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    };


    // Editar tarea de

    const handleModalUpdateTask = (task) => {
        // console.log(task)
        setTaskPro(task)
        setModalFormTask(true)
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
                loading,
                deleteProject,
                modalFormTask,
                handleModalTask,
                submitTask,
                handleModalUpdateTask,
                taskPro,
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