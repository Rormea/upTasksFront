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
    const [modalDeleteTask, setModalDeleteTask] = useState(false)
    const [coworker, setCoworker] = useState({})
    const [modalDeleteCoworker, setModalDeleteCoworker] = useState(false)
    const [search, setSearch] = useState(false)

    const navigate = useNavigate();



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

            showAlert({
                msg: data.msg,
                error: false
            })


        } catch (error) {
            navigate('/projects')
            // showAlert({
            //     msg: error.response.data.msg,
            //     error: true
            // })
            // no usamos showAlert aqui porque ya tiene un tiempo para que la alerta de error desaraezca
            // y como el error aqui no deberia dar acceso a nada necesito que el mesaje de error persista 
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setLoading(false)
        }
    };


    // Borrar proyecto

    const deleteProject = async (id) => {

        const idTask = projetAlone.tasks.map(task => task._id)
        // console.log(idTask)
        // el proeycto viene con us tareas que es un [{},{},...] vamos a sacar otro [] de solo los _id

        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            // Eliminar las tareas asociadas a ese proyecto
            idTask.map(async el => (
                await clientAxios.delete(`/tasks/${el}`, config)
            ));

            // Ahora si elinar el proyecto
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

            // console.log(!taskPro._id) da respuest true  dice si en task pro que es cuando doy click en editar no hay id quiere decir 
            //que no es editar es true ejecuta crear tarea si es false (else) ejecuta actulizar tarea
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

    // Eliminar tarea
    const handleModalDeleteTask = (task) => {
        setTaskPro(task)
        setModalDeleteTask(!modalDeleteTask)

    };

    //borrar tarea
    const deleteTask = async () => {

        // console.log(taskPro)
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

            const idTask = taskPro._id

            const { data } = await clientAxios.delete(`/tasks/${idTask}`, config);

            const projectWithTaskDeleted = { ...projetAlone }
            projectWithTaskDeleted.tasks = projectWithTaskDeleted.tasks.filter(el => el._id !== idTask)
            console.log(projectWithTaskDeleted)
            setProjetAlone(projectWithTaskDeleted)
            setModalDeleteTask(false)
            setTaskPro({})

            showAlert({
                msg: "Tarea Eliminada",
                error: false
            })

            setAlert({})

        } catch (error) {
            console.log(error)
        }
    };

    const submitCoworker = async (emailCoworker) => {

        // console.log(emailCoworker)
        // return
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

            const { data } = await clientAxios.post(`/projects/coworkers`, { email: emailCoworker }, config);
            // console.log(data)

            setCoworker(data);
            setAlert({});

            // showAlert({
            //     msg: "Tarea Eliminada",
            //     error: false
            // })

        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setLoading(false);
        }
    };

    //// Agregar  colaborador ////////////

    const addCoworker = async (email) => {

        // console.log(projetAlone)
        setLoading(true);

        const idProject = projetAlone._id
        // console.log(idProject)

        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clientAxios.post(`/projects/coworkers/${idProject}`, email, config);
            console.log(data)

            showAlert({
                msg: data.msg,
                error: false
            })

            setCoworker({});

        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setLoading(false);
        }


    };


    // Modal para eliminar Coworker
    const handleModalDeleteCoworker = (coworker) => {
        setModalDeleteCoworker(!modalDeleteCoworker)
        setCoworker(coworker)
    };

    // Eliminar colaborador

    const deleteCoworker = async () => {



        try {

            const token = localStorage.getItem('token');
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const idCoworker = coworker._id

            const { data } = await clientAxios.post(`/projects/delete-coworker/${projetAlone._id}`, { id: idCoworker }, config);


            const projectUpdatedCoworker = { ...projetAlone }
            projectUpdatedCoworker.coworkers = projectUpdatedCoworker.coworkers.filter(el => el._id !== idCoworker)
            setProjetAlone(projectUpdatedCoworker)
            setModalDeleteCoworker(false)
            setCoworker({})


            showAlert({
                msg: "Colaborador Eliminado",
                error: false
            })



        } catch (error) {
            console.log(error)
        }
    };

    // Cambiar tarea completa / incomplete

    const taskCompleted = async (id) => {

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


            const { data } = await clientAxios.post(`/tasks/state/${id}`, {}, config);


            const projectWithTaskStateUpdated = { ...projetAlone }
            // // el objeto proyectoAlone tiene dentro un array que son las tareas
            projectWithTaskStateUpdated.tasks = projectWithTaskStateUpdated.tasks.map(el => el._id === data._id ? data : el)
            setProjetAlone(projectWithTaskStateUpdated)
            setTaskPro({})

            showAlert({
                msg: data.msg,
                error: false
            })

        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setLoading(false);
        }
    };


    // Buscador de project

    const handleSearch = () => {
        setSearch(!search);
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
                modalDeleteTask,
                handleModalDeleteTask,
                deleteTask,
                submitCoworker,
                coworker,
                addCoworker,
                handleModalDeleteCoworker,
                modalDeleteCoworker,
                deleteCoworker,
                taskCompleted,
                search,
                handleSearch,


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