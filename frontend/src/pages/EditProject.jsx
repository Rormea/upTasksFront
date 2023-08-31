import React, { useEffect } from 'react'
import useProjects from '../hooks/useProjects';
import { useParams } from 'react-router-dom';
import FormProject from '../components/FormProject';

const EditProject = () => {


    const params = useParams();
    const { getProject, projetAlone, loading } = useProjects();

    useEffect(() => {
        getProject(params.id)
    }, [])

    const { name } = projetAlone;


    if (loading) return "Cargando..."

    return (
        <div>
            <h1 className='text-4xl font-black' >{name}</h1>

            <div className='mt-10 flex justify-center' >
                <FormProject />
            </div>

        </div>
    )
}

export default EditProject