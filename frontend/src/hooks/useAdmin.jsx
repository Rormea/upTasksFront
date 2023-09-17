import useProjects from "./useProjects"
import useAuth from './useAuth'





const useAdmin = () => {

    const { projetAlone } = useProjects();
    const { auth } = useAuth();


    return projetAlone.owner === auth._id
}

export default useAdmin