import { useState } from 'react'
import useProjects from '../hooks/useProjects';
import Alert from './Alert';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';



const FormProject = () => {

    const initialProjectState = {
        name: '',
        description: '',
        client: '',
        deadline: '',
    }



    const [valuePro, setValuePro] = useState(initialProjectState)
    const [paramsId, setParamsId] = useState(null)

    const params = useParams();


    /////////////////////////////////////////////////////////

    const { showAlert, alert, submitProject, projetAlone } = useProjects();

    /////////////////////////////////////////////////////////////////    

    useEffect(() => {
        if (params.id && projetAlone) {

            const projectUpdated = {
                name: projetAlone.name,
                description: projetAlone.description,
                client: projetAlone.client,
                deadline: projetAlone.deadline.split('T')[0],
            }
            setValuePro(projectUpdated)
            setParamsId(params.id)
        } else {
            console.log("nuevo project")
        }
    }, [params])


    const handleChange = (e) => {
        const value = e.target.value
        const key = e.target.name
        setValuePro({ ...valuePro, [key]: value })
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(valuePro).includes('')) {
            showAlert({
                msg: "Todos los campos son requeridos",
                error: true
            })
            return
        };
        // pasar todo al provider
        await submitProject({ ...valuePro, paramsId });

        setValuePro(initialProjectState)
        setParamsId(null);
    };


    const { msg } = alert

    return (
        <form
            onSubmit={handleSubmit}
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow-md'
        >
            {msg && <Alert alert={alert} />}
            <div>
                <label htmlFor="name" className='text-gray-700 uppercase font-bold text-sm'>
                    Nombre del Proyecto
                </label>
                <input className='border-2 w-full mt-2 placeholder-gray-400 rounded-md '
                    type="text"
                    id='name'
                    placeholder='Nombra tu Proyecto'
                    value={valuePro.name}
                    name='name'
                    onChange={handleChange}
                />
            </div>

            <div className='mt-5' >
                <label htmlFor="description" className='text-gray-700 uppercase font-bold text-sm'>
                    Descripción
                </label>
                <textarea className='border-2 w-full mt-2 placeholder-gray-400 rounded-md '
                    id='description'
                    placeholder='Descripción del Proyecto'
                    value={valuePro.description}
                    name='description'
                    onChange={handleChange}
                />
            </div>

            <div className='mt-5'>
                <label htmlFor="deadline" className='text-gray-700 uppercase font-bold text-sm'>
                    Fecha de entrega
                </label>
                <input className='border-2 w-full mt-2 placeholder-gray-400 rounded-md '
                    type="date"
                    id='deadline'
                    placeholder='Ingresa la fecha de entrega'
                    value={valuePro.deadline}
                    name='deadline'
                    onChange={handleChange}
                />
            </div>

            <div className='mt-5'>
                <label htmlFor="client" className='text-gray-700 uppercase font-bold text-sm'>
                    Nombre del Proyecto
                </label>
                <input className='border-2 w-full mt-2 placeholder-gray-400 rounded-md '
                    type="text"
                    id='client'
                    placeholder='Nombra tu Cliente'
                    value={valuePro.client}
                    name='client'
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                value={paramsId ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className=' py-2 mt-8 bg-sky-600 w-full uppercase font-bold text-white rounded-md
                cursor-pointer hover:bg-sky-800 transition-color'
            />

        </form>
    )
}

export default FormProject