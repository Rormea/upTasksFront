import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Sidebar = () => {

    const { auth } = useAuth();

    return (
        <aside className='md:w-80 lg:w-96 bg-orange-400 px-5 py-10' >
            <p className='text-xl font-bold' >{auth.name}</p>
            <Link to="new-project" className='bg-sky-600 w-full p-3 text-white uppercase font-bold rounded-md block mt-5 text-center' >
                Crear Proyecto
            </Link>

        </aside>
    )
}

export default Sidebar