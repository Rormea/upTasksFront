import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert';
import clientAxios from '../config/clientAxios';

const PasswordNew = () => {

    const [password, setPassword] = useState('')
    const [updatePassword, setUpdatePassword] = useState(false)

    const [validatedToken, setValidatedToken] = useState(false)
    const [alert, setAlert] = useState({})

    const { token } = useParams();
    console.log(token)

    useEffect(() => {
        const tokenConfirm = async () => {
            try {
                const url = `/users/recovery-password/${token}`
                // console.log(url)
                await clientAxios.get(url)

                setValidatedToken(true);

            } catch (error) {
                setAlert(
                    {
                        msg: error.response.data.msg,
                        error: true
                    }
                )
            }
        };

        tokenConfirm();
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password === '') {
            setAlert(
                {
                    msg: 'El campo password es requerido',
                    error: true
                }
            );
            return
        }

        const passwordPattern = /^(?=.*[0-9])(?!.*[!@#$%^&*()_+[\]{}|;:',.<>?\\\/]).{6,}$/;

        if (passwordPattern.test(password) === false) {
            setAlert(
                {
                    msg: 'Password debe ser mayor a 5 dígitos, tener al menos un número y no usar caracteres especiales',
                    error: true
                }
            );
            return
        }

        try {
            const url = `/users/recovery-password/${token}`
            const { data } = await clientAxios.post(url, { password })

            setAlert(
                {
                    msg: data.msg,
                    error: false
                }
            );

            setUpdatePassword(true);

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
        <div className='flex flex-col'>
            <h1 className='text-sky-600 font-black text-6xl capitalize' >
                Restablece tu contraseña y pierdas acceso a tus <span className='text-slate-700' >proyectos</span>
            </h1>

            {msg && <Alert alert={alert} />}

            {validatedToken && (
                <form onSubmit={handleSubmit}
                    className='my-10 bg-white shadow rounded-3xl py-10 px-5' >

                    <div className='my-5' >
                        <label htmlFor='password' className='uppercase text-gray-700 block text-xl font-bold mb-5' >Nueva Contraseña</label>
                        <input
                            id='password'
                            type="password"
                            placeholder='Escribe tu nueva contraseña'
                            className='w-full mt-3 p-3 border raounded-xl bg-gray-50 mb-3 '
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>


                    <input type="submit"
                        value="Actualizar Contraseña"
                        className='bg-sky-700 w-full py-3 text-white uppercase 
                    font-bold rounded-2xl hover:cursor-pointer hover:bg-sky-900 transition-colors'
                    />
                </form>
            )}

            {updatePassword && (
                <button className=' justify-center  text-center my-5 bg-sky-600 uppercase text-white font-bold text-sm rounded-xl p-3'>
                    <Link to='/' >
                        Inicia Sesión
                    </Link>
                </button>
            )}

        </div>
    )
}

export default PasswordNew