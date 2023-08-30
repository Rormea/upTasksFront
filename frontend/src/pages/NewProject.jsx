import React from 'react'
import FormProject from '../components/FormProject'

const NewProject = () => {


    return (
        <div>
            <h1 className='text-4xl font-black mb-20' >Crear Proyecto</h1>

            <div className='mt-10 flex justify-center' >
                <FormProject />
            </div>
        </div>
    )
}

export default NewProject