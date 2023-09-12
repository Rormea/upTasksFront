import React, { useEffect } from 'react'
import FormCoworker from '../components/FormCoworker'
import useProjects from '../hooks/useProjects';
import { useParams } from 'react-router-dom';

const NewCoworker = () => {


    const { getProject, projetAlone, loading, coworker, addCoworker } = useProjects();

    const params = useParams();

    useEffect(() => {
        getProject(params.id);
    }, []);

    // if (loading) return 'Cargando'

    return (
        <div>
            <h1 className='text-4xl font-black' >Agregar Colaborador</h1>
            <p className='mt-5 py-2 text-2xl font-bold'  >{projetAlone.name}</p>

            <div className='mt-10 flex justify-center' >
                <FormCoworker />
            </div>

            {loading ? <p className="text-center">cargando...</p> : coworker?._id && (
                <div className='flex justify-center mt-10'>
                    <div className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full'>
                        <h2 className='text-center mb-10 text-2xl font-bold'>Resultado:</h2>

                        <div className='flex justify-between items-center'>
                            <p>{coworker.name}</p>

                            <button
                                type="button"
                                className='bg-sky-600 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm'
                                onClick={() => addCoworker({
                                    email: coworker.email
                                })}
                            >Agregar al Proyecto</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NewCoworker