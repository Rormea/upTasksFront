import React from 'react'
import useProjects from '../hooks/useProjects';

const Coworker = ({ coworker }) => {

    const { handleModalDeleteCoworker, modalDeleteCoworker } = useProjects();

    return (

        <div className='border-b p-5 flex justify-between items-center' >
            <div>
                <p>{coworker.name}</p>
                <p className='text-sm text-gray-700' >{coworker.email}</p>
            </div>

            <div>
                <button
                    onClick={() => handleModalDeleteCoworker(coworker)}
                    type='button' className='text-white text-sm font-bold bg-red-600 p-2 rounded-md mt-5 flex gap-2 py-2 
                    items-center justify-center w-full md:w-auto '
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}

export default Coworker