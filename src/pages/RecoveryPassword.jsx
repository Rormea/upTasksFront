import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert';
import clientAxios from '../config/clientAxios';

const RecoveryPassword = () => {

    const [email, setEmail] = useState('')
    const [alert, setAlert] = useState({})


    const habdleSubmmit = async (e) => {
        e.preventDefault();

        if (email === '') {
            setAlert(
                {
                    msg: 'El campo email es requerido',
                    error: true
                }
            );
            return
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (emailPattern.test(email) === false) {
            setAlert(
                {
                    msg: 'Ingresa un correo válido',
                    error: true
                }
            );
            return
        }

        try {
            const { data } = await clientAxios.post(`/users/recovery-password`, { email })

            setAlert(
                {
                    msg: data.msg,
                    error: false
                }
            );

        } catch (error) {
            setAlert(
                {
                    msg: error.response.data.msg,
                    error: true
                }
            );
        }
    };

    const { msg } = alert

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize' >
                Recupera tu acceso y no pierdas tus <span className='text-slate-700' >proyectos</span>
            </h1>

            {msg && <Alert alert={alert} />}

            <form
                className='my-10 bg-white shadow rounded-3xl py-10 px-5' >

                <div className='my-5' >
                    <label htmlFor='email' className='uppercase text-gray-700 block text-xl font-bold' >Correo</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='Ingresa el Correo de Registro'
                        className='w-full mt-3 p-3 border raounded-xl bg-gray-50'
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>


                <input type="submit"
                    value="Enviar Instrucciones"
                    className='bg-sky-700 w-full py-3 text-white uppercase 
                    font-bold rounded-2xl hover:cursor-pointer hover:bg-sky-900 transition-colors'
                    onClick={habdleSubmmit}
                />
            </form>

            <nav className='lg:flex lg:justify-between' >
                <Link to='/sign-up' className='block text-center my-5 text-slate-500 uppercase text-sm' >
                    ¿No tienes una cuenta? Regístrate
                </Link>

                <Link to='/' className='block text-center my-5 text-slate-500 uppercase text-sm' >
                    ¿Ya tienes una cuenta? Inicia Sesión
                </Link>
            </nav>
        </>
    )
}

export default RecoveryPassword