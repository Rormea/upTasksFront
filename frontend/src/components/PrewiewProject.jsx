import React from 'react'
import { Link } from 'react-router-dom'

const PrewiewProject = ({ project }) => {

    const { name, _id, client } = project

    return (
        <div className='border-b p-5 flex justify-between' >
            <p>
                {name}
            </p>

            <button type='button' className='text-white text-sm font-bold bg-sky-600 p-2 rounded-md' >
                <Link
                    to={`${_id}`}
                >Ver Proyecto</Link>
            </button>


        </div>
    )
}

export default PrewiewProject