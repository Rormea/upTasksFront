
import useProjects from '../hooks/useProjects'
import useAdmin from "../hooks/useAdmin";

const Task = ({ task }) => {

    const { handleModalUpdateTask, handleModalDeleteTask, taskCompleted } = useProjects();

    const adminOn = useAdmin();

    return (
        <div className='border-b  lg:p-5  items-center flex flex-col lg:flex-row" ' >
            <div className='lg:w-full w-1/2 my-2' >
                <p className='mb-1 text-xl  font-bold text-sky-600' >{task.name}</p>
                <p className='mb-1 text-lg' >{task.description}</p>
                <p className='mb-1 text-sm text-sky-600 font-bold' >{task.deadline.split('T')[0]}</p>
                <p className='mb-1 text-gray-600' >Prioridad: {task.priority}</p>
                {task.state && <p>Completado por: {task.completed.name}</p>}
            </div>

            <div className='lg:w-full w-1/2 my-2 ' >
                {adminOn && (

                    <button onClick={() => handleModalUpdateTask(task)} className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2 w-min-24 w-24 '>Editar</button>
                )}

                <button
                    onClick={() => taskCompleted(task._id)}
                    className={` ${task.state ? 'bg-sky-600' : 'bg-gray-600'} p-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2 `}
                >
                    {task.state ? 'Completa' : 'Imcompleta'}
                </button>
                {/* {task.state
                    ? (<button onClick={() => taskCompleted(task._id)} className='bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2 ' >Completa</button>)
                    : (<button onClick={() => taskCompleted(task._id)} className='bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2'>Incompleta</button>)
                } */}

                {adminOn && (
                    <button className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2 ' onClick={() => handleModalDeleteTask(task)}  >Eleminar</button>
                )}

            </div>
        </div>
    )
}

export default Task