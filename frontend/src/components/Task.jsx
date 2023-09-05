import { formatDate } from "../helpers/formatDate"
import useProjects from '../hooks/useProjects'

const Task = ({ task }) => {

    const { handleModalUpdateTask } = useProjects();

    return (
        <div className='border-b  lg:p-5  items-center flex flex-col lg:flex-row" ' >
            <div className='lg:w-full w-1/2 my-2' >
                <p className='mb-1 text-xl  font-bold text-sky-600' >{task.name}</p>
                <p className='mb-1 text-lg' >{task.description}</p>
                <p className='mb-1 text-sm text-sky-600 font-bold' >{formatDate(task.deadline)}</p>
                <p className='mb-1 text-gray-600' >Prioridad: {task.priority}</p>
            </div>

            <div className='lg:w-full w-1/2 my-2 ' >
                <button onClick={() => handleModalUpdateTask(task)} className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2'>Editar</button>
                {task.state
                    ? (<button className='bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2 ' >Completa</button>)
                    : (<button className='bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2 ' >Incompleta</button>)
                }
                <button className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg mr-2 mb-2 ' >Eleminar</button>
            </div>
        </div>
    )
}

export default Task