import React from 'react'
import useProjects from '../hooks/useProjects'
import PrewiewProject from '../components/PrewiewProject';



const Projects = () => {

    const { projects } = useProjects();


    return (
        <div>
            <h1 className='text-4xl font-black' >Proyectos</h1>

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