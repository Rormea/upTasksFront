import React, { useEffect } from 'react'
import useProjects from '../hooks/useProjects';
import { Link, useParams } from 'react-router-dom';
import FormProject from '../components/FormProject';

const EditProject = () => {


    const params = useParams();


    const { getProject, projetAlone, loading, deleteProject } = useProjects();

    useEffect(() => {
        getProject(params.id)
    }, [])

    const { name } = projetAlone;


    const handleClick = () => {
        if (confirm('¿Confirmas la eliminación de este proyecto?')) {
            deleteProject(params.id);
        }
    };


    if (loading) return "Cargando..."

    return (
        <div>


            <div className='border-b p-5 flex ' >
                <p className='text-4xl font-black flex-1'>
                    {name}
                </p>

                <button type='button' className='text-white text-sm font-bold bg-red-600 p-2 rounded-md' onClick={handleClick} >
                    <span className="hidden md:inline">Eliminar</span>
                    <span className="md:hidden px-2 ">x</span>
                </button>


            </div>

            <div className='mt-10 flex justify-center' >
                <FormProject />
            </div>

        </div>
    )
}

export default EditProject