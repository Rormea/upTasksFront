import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";



const ProtectedRoute = () => {

    const { auth, loading } = useAuth();

    if (loading) return 'Cargando...'

    return (
        <div>

            {Object.values(auth).length > 0 ?
                // console.log(Object.values(auth).length > 0)
                (
                    <div className="bg-gay-100" >
                        <Header />

                        <div className="md:flex md:min-h-screen" >
                            <Sidebar />

                            <main className="flex-1 p-10 bg-violet-100" >
                                <Outlet />
                            </main>
                        </div>

                    </div>
                )
                : <Navigate to='/' />}
        </div>
    )
}

export default ProtectedRoute