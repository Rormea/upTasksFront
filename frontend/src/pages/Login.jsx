import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert';
import clientAxios from '../config/clientAxios';

import useAuth from '../hooks/useAuth';

const Login = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({})

    const navigate = useNavigate()

    const { setAuth } = useAuth();



    const handlerSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes('')) {
            setAlert({ msg: 'Todos los campos son requeridos', error: true });
            return
        }

        const passwordPattern = /^(?=.*[0-9])(?!.*[!@#$%^&*()_+[\]{}|;:',.<>?\\\/]).{6,}$/;
        if (passwordPattern.test(password) === false) {
            setAlert({ msg: 'Password debe ser mayor a 5 dígitos, tener al menos un número y no usar caracteres especiales', error: true });
            return
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailPattern.test(email) === false) {
            setAlert({ msg: 'Ingresa un correo válido', error: true });
            return
        }

        try {

            const { data } = await clientAxios.post('/users/login', { email, password });
            // console.log(data.token);

            setAlert({});
            localStorage.setItem('token', data.token);
            setAuth(data)
            // console.log(data)
            navigate('/projects')



        } catch (error) {
            console.log(error);
            setAlert({ msg: error.response.data.msg, error: true });
        }


    };

    const { msg } = alert

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize' >
                Inicia sesión y administra tus <span className='text-slate-700' >proyectos</span>
            </h1>

            {msg && <Alert alert={alert} />}

            <form onSubmit={handlerSubmit}
                className='my-10 bg-white shadow rounded-3xl py-10 px-5' >

                <div className='my-5' >
                    <label htmlFor='email' className='uppercase text-gray-700 block text-xl font-bold' >Correo</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='Correo de Registro'
                        className='w-full mt-3 p-3 border raounded-xl bg-gray-50'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className='my-5' >
                    <label htmlFor='password' className='uppercase text-gray-700 block text-xl font-bold mb-5' >Contraseña</label>
                    <input
                        id='password'
                        type="password"
                        placeholder='Contraseña de Registro'
                        className='w-full mt-3 p-3 border raounded-xl bg-gray-50 mb-3 '
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <input type="submit"
                    value="Iniciar Sesión"
                    className='bg-sky-700 w-full py-3 text-white uppercase 
                    font-bold rounded-2xl hover:cursor-pointer hover:bg-sky-900 transition-colors'
                />

            </form>

            <nav className='lg:flex lg:justify-between' >
                <Link to='sign-up' className='block text-center my-5 text-slate-500 uppercase text-sm' >
                    ¿No tienes una cuenta? Regístrate...
                </Link>

                <Link to='/recovery-password' className='block text-center my-5 text-slate-500 uppercase text-sm' >
                    Recuperar mi password...
                </Link>
            </nav>
        </>
    )
}

export default Login