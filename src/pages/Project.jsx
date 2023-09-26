import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import useAdmin from '../hooks/useAdmin';
import Task from '../components/Task';
import ModalFormTask from '../components/ModalFormTask';
import ModalDeleteTask from '../components/ModalDeleteTask';
import Alert from '../components/Alert';
import Coworker from '../components/Coworker';
import ModalDeleteCoworker from '../components/ModalDeleteCoworker';
import io from 'socket.io-client'



let socket;


const Project = () => {

    const params = useParams();

    const { getProject, projetAlone, loading, handleModalTask, alert, createTaskIo, removeTaskIo, updateTaskIo, changeStateTask } = useProjects();

    const adminOn = useAdmin();
    // console.log(adminOn)


    useEffect(() => {
        getProject(params.id)

    }, [])


    // este useffect se ejecuta solo una vez cuando entramos a ver un proeycto
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);

        socket.emit('Open project', params.id)
    }, [])

    //  , en todo momento esá escuchando
    useEffect(() => {
        socket.on('added NewTask', (newTask) => {
            // console.log(newTask)
            if (newTask.projectRef === projetAlone._id) {
                createTaskIo(newTask)
            }
        })

        socket.on('remove Task', (removeTask) => {
            if (removeTask.projectRef === projetAlone._id) {
                removeTaskIo(removeTask)
            }
        })

        socket.on('updated Task', (updatedTask) => {
            // console.log(updatedTask)
            if (updatedTask.projectRef._id === projetAlone._id) {
                updateTaskIo(updatedTask)
            }
        })

        socket.on('completed Task', (taskWithStateChange) => {
            // console.log(taskWithStateChange)
            if (taskWithStateChange.projectRef._id === projetAlone._id) {
                changeStateTask(taskWithStateChange)
            }
        })
    })



    // console.log(projetAlone)


    const { name, description } = projetAlone



    // const [modal, setModal] = useState(false)


    if (loading) return "Cargando..."

    const { msg } = alert

    return (


        <div>
            <div className='flex justify-between'>
                <h1 className='font-black text-3xl'>{name}</h1>

                {adminOn && (

                    <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <Link
                            to={`/projects/update/${params.id}`}
                            className='uppercase font-bold'
                        >Editar</Link>
                    </div>
                )}
            </div>

            <p className='bg-white shadow mt-10 rounded-lg' >{description}</p>


            {adminOn && (

                <button onClick={handleModalTask}
                    type='button' className='text-white text-sm font-bold bg-sky-600 p-2 rounded-md mt-5 flex gap-2 py-2 items-center justify-center w-full md:w-auto '  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Agregar Tarea
                </button>
            )}


            <p className='font-bold text-xl mt-10' >Taras del Proyecto</p>

            {/* {msg && <Alert alert={alert} />} */}

            <div className='bg-white shadow mt-10 rounded-lg' >
                {projetAlone.tasks?.length ?
                    projetAlone.tasks?.map(task => (

                        < Task key={task._id} task={task} />


                    ))
                    : 'No hay tareas'}


            </div>


            {adminOn && (
                <div>
                    <div className='flex items-center justify-between mt-10' >
                        <p className='font-bold text-xl'  >Colaboradores</p>
                        <Link to={`/projects/new-coworker/${projetAlone._id}`} className='text-gray-400 uppercase hover:text-black font-bold '>Añadir</Link>
                    </div>

                    <div className='bg-white shadow mt-10 rounded-lg' >
                        {projetAlone.coworkers?.length ?
                            projetAlone.coworkers?.map(coworker => (
                                <Coworker key={coworker._id} coworker={coworker} />
                            ))
                            : 'No hay Colaboradores'}
                    </div>

                </div>
            )}


            <ModalFormTask />
            <ModalDeleteTask />
            <ModalDeleteCoworker />

        </div>


    )

}

export default Project