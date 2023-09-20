import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const PrewiewProject = ({ project }) => {

    const { auth } = useAuth();

    const { name, _id, client, owner } = project

    return (
        <div className='border-b p-5 flex flex-col sm:flex-row ' >
            <div className='flex-1  '>
                <div className='' >
                    <span>{name}</span>

                    <span className='text-sm text-sky-600 uppercase' >{' - '} {client}</span>

                    {
                        auth._id !== owner && (
                            <span className='p-1 text-sm rounded-lg text-white bg-green-600  ml-2' >
                                Coworker
                            </span>
                        )
                    }
                </div>
            </div>



            <button type='button' className='text-white text-sm font-bold bg-sky-600 p-2 rounded-md' >
                <Link
                    to={`${_id}`}
                >Ver Proyecto</Link>
            </button>


        </div>
    )
}

export default PrewiewProject