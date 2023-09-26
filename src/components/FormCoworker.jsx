import React, { useState } from 'react'
import useProjects from '../hooks/useProjects';
import Alert from './Alert';



const FormCoworker = () => {

    const [emailCoworker, setEmailCoworker] = useState('')

    const { showAlert, alert, submitCoworker } = useProjects();



    const handleSubmit = (e) => {

        e.preventDefault();
        if (emailCoworker === '') {
            showAlert({
                msg: "Todos los campos son requeridos",
                error: true
            })

            return
        };

        submitCoworker(emailCoworker);
    };


    const { msg } = alert

    return (

        <form
            onSubmit={handleSubmit}
            className='bg-white py-10 px-5 md: w-1/2 rounded-lg shadow'
        >
            {msg && <Alert alert={alert} />}

            <div className='mb-5' >
                <label htmlFor="emailCoworker" className='text-sky-600 uppercase font-bold text-sm'>Email Colaborador</label>
                <input
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Buscar por Email'
                    type="email"
                    id="emailCoworker"
                    value={emailCoworker}
                    onChange={(e) => setEmailCoworker(e.target.value)}
                />
            </div>

            <input type="submit"
                className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white
                                            font-bold cursor-pointer transition-colors rounded-md uppercase'
                value='Buscar Colaborador'

            />

        </form>
    )
}

export default FormCoworker