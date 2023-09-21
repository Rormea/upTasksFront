import React, { useEffect } from 'react'
import useProjects from '../hooks/useProjects'
import PrewiewProject from '../components/PrewiewProject';
import Alert from '../components/Alert'


const Projects = () => {

    const { projects } = useProjects();

    const { msg } = alert

    // useEffect(() => {
    //     socket = io(import.meta.env.VITE_BACKEND_URL);
    //     socket.emit('proof', projects)
    //     socket.on('response', (persona) => {
    //         console.log('Desde el backend', persona);
    //     });
    // });

    return (
        <div>
            <h1 className='text-4xl font-black' >Proyectos</h1>

            {msg && <Alert alert={alert} />}

            <div className='bg-white shadow mt-10 rounded-lg ' >
                {projects.length ? projects.map(project => (
                    <PrewiewProject
                        key={project._id}
                        project={project}
                    />
                ))
                    : <p className='mt-5 text-center text-gray-600 uppercase p-5' >No hay Proyectos</p>}
            </div>
        </div>
    )
}

export default Projects