import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert';
import clientAxios from '../config/clientAxios';

function ConfirmAccount() {

    const [alert, setAlert] = useState({})
    const [accountConfirm, setAccountConfirm] = useState(false)

    const params = useParams();
    const { id } = params

    useEffect(() => {
        const confirmAccount = async () => {
            try {
                const url = `/users/confirm-account/${id}`
                // console.log(url)
                const { data } = await clientAxios.get(url)
                console.log(data.msg)
                setAlert(
                    {
                        msg: data.msg,
                        error: false
                    }
                )

                setAccountConfirm(true);

            } catch (error) {
                setAlert(
                    {
                        msg: error.response.data.msg,
                        error: true
                    }
                )
                // setAccountConfirm(false)

            }
        }

        confirmAccount();
    }, []);

    const { msg } = alert

    return (
        <div className='flex flex-col'>
            <h1 className='text-sky-600 font-black text-6xl capitalize' >
                Confirma tu cuenta y empieza a crear tus <span className='text-slate-700' >proyectos</span>
            </h1>

            <div>
                {msg && <Alert alert={alert} />}

            </div>


            {accountConfirm && (
                <button className=' justify-center  text-center my-5 bg-sky-600 uppercase text-white font-bold text-sm rounded-xl p-3'>
                    <Link to='/' >
                        Inicia Sesión
                    </Link>
                </button>
            )}

        </div>
    )
}

export default ConfirmAccount