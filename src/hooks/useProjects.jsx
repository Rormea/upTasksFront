import { useContext } from 'react';
import ProyectosContext from '../context/ProyectoProvider';

const useProjects = () => {

    return useContext(ProyectosContext);

};


export default useProjects