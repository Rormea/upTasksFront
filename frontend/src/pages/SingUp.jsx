import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import clientAxios from '../config/clientAxios'

const SingUp = () => {


    const [alert, setAlert] = useState({})
    const [valueSingUp, setValueSingUp] = useState({
        name: "",
        email: "",
        password: "",
        repeatPass: ""
    })

    const handlerOnChange = (e) => {
        const value = e.target.value
        const key = e.target.name
        setValueSingUp({ ...valueSingUp, [key]: value })
        // console.log(`${key}:${value}`)
    };

    const handlerSubmit = async (e) => {
        e.preventDefault();
        // console.log(valueSingUp)
        if (Object.values(valueSingUp).includes('')) {
            setAlert({
                msg: "Todos los campos son requeridos",
                error: true
            });
            return
        };

        if (valueSingUp.password !== valueSingUp.repeatPass) {
            setAlert({
                msg: "Las contraseñas de registro no coinciden",
                error: true
            });
            return
        }
        setAlert({});

        // SI ya pasamos todos las validaciones entonces mostrar usuaruo en la API

        try {
            const { data } = await clientAxios.post(`/users`, valueSingUp)

            // console.log(data.msg)
            setAlert(
                {
                    msg: data.msg,
                    error: false
                }
            );

            setValueSingUp({
                name: "",
                email: "",
                password: "",
                repeatPass: ""
            });

        } catch (error) {

            // console.log(error.response.data.msg)
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
                Crea tu cuenta y administra tus <span className='text-slate-700' >proyectos</span>
            </h1>

            {msg && <Alert alert={alert} />}

            <form className='my-10 bg-white shadow rounded-3xl py-10 px-5' >

                <div className='my-5' >
                    <label htmlFor='name' className='uppercase text-gray-700 block text-xl font-bold' >Nombre</label>
                    <input
                        id='name'
                        type="text"
                        placeholder='Nombre de Usuario'
                        className='w-full mt-3 p-3 border raounded-xl bg-gray-50'
                        value={valueSingUp.name}
                        name='name'
                        onChange={handlerOnChange}
                    />
                </div>

                <div className='my-5' >
                    <label htmlFor='email' className='uppercase text-gray-700 block text-xl font-bold' >Correo</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='Correo de Registro'
                        className='w-full mt-3 p-3 border raounded-xl bg-gray-50'
                        value={valueSingUp.email}
                        name='email'
                        onChange={handlerOnChange}
                    />
                </div>

                <div className='my-5' >
                    <label htmlFor='password' className='uppercase text-gray-700 block text-xl font-bold mb-5' >Contraseña</label>
                    <input
                        id='password'
                        type="password"
                        placeholder='Contraseña de Registro'
                        className='w-full mt-3 p-3 border raounded-xl bg-gray-50 mb-3 '
                        value={valueSingUp.password}
                        name='password'
                        onChange={handlerOnChange}
                    />
                </div>

                <div className='my-5' >
                    <label htmlFor='password2' className='uppercase text-gray-700 block text-xl font-bold mb-5' >Repetir Contraseña</label>
                    <input
                        id='password2'
                        type="password"
                        placeholder='Repetir Contraseña'
                        className='w-full mt-3 p-3 border raounded-xl bg-gray-50 mb-3 '
                        value={valueSingUp.repeatPass}
                        name='repeatPass'
                        onChange={handlerOnChange}
                    />
                </div>

                <input type="submit"
                    value="Crear Cuenta"
                    className='bg-sky-700 w-full py-3 text-white uppercase 
                    font-bold rounded-2xl hover:cursor-pointer hover:bg-sky-900 transition-colors'
                    onClick={handlerSubmit}
                />
            </form>

            <nav className='lg:flex lg:justify-between' >
                <Link to='/' className='block text-center my-5 text-slate-500 uppercase text-sm' >
                    ¿Ya tienes una cuenta? Inicia Sesión
                </Link>

                <Link to='/recovery-password' className='block text-center my-5 text-slate-500 uppercase text-sm' >
                    Recuperar mi password...
                </Link>
            </nav>
        </>
    )
}

export default SingUp