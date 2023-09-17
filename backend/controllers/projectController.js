import mongoose from "mongoose";
import ProjectM from "../models/ProjectModel.js";
import TasksM from "../models/TasksModel.js";
import UserM from "../models/UserModel.js";


const getProjects = async (req, res) => {

    const { userReq } = req

    const projects = await ProjectM.find({
        '$or': [
            { 'coworkers': { $in: userReq } },
            { 'owner': { $in: userReq } }
        ]
    })
        // con el código de arriba ya no hago el where - equals   
        // .where('owner')
        // .equals(userReq)
        .select("-tasks");

    res.json(projects)
};



const newProject = async (req, res) => {

    const project = new ProjectM(req.body)
    project.owner = req.userReq._id

    try {
        const projectDb = await project.save();
        res.json(projectDb);
    } catch (error) {
        console.log(error)
    }
};


const getOneProject = async (req, res) => {

    const { id } = req.params;

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('invalid format  => idFormatMongoose');
        return res.status(404).json({ msg: error.message })
    };
    //Validar que el proyecto con ese id existe
    const beProject = await ProjectM.findById(id)
        .populate('tasks')
        .populate('coworkers', 'name email');
    if (!beProject) {
        const error = new Error('id not found');
        return res.status(404).json({ msg: error.message })
    };
    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beProject.owner.toString() !== req.userReq._id.toString() &&
        //dice si no es el dueño del proeycto quien quiere verlo accion no valida 
        !beProject.coworkers.some(coworker => coworker._id.toString() === req.userReq._id.toString())
        // aqui valida que si laguno de la lista de id de colaboradores coinciade con el  id del path y miega todo
        // Dice si no es colaborador del proeycto accion no valida
    ) {
        const error = new Error('You are not the owner || coworker of this project');
        return res.status(401).json({ msg: error.message })
    }

    // Obtener tareas asociadas al proyecto

    // const tasksInProject = await TasksM.find().where("projectRef").equals(beProject._id);

    // res.json({beProject,tasksInProject});
    res.json(beProject);
};



const editProject = async (req, res) => {

    const { id } = req.params;

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('id invalid format');
        return res.status(404).json({ msg: error.message })
    };
    //Validar que el proyecto con ese id existe
    const beProject = await ProjectM.findById(id);
    if (!beProject) {
        const error = new Error('id not found');
        return res.status(404).json({ msg: error.message })
    };
    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beProject.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('You are not the owner of this project');
        return res.status(401).json({ msg: error.message })
    }

    beProject.name = req.body.name || beProject.name
    beProject.deadline = req.body.deadline || beProject.deadline
    beProject.client = req.body.client || beProject.client
    beProject.description = req.body.description || beProject.description

    try {
        const upDateProject = await beProject.save();
        res.json(upDateProject);
    } catch (error) {
        console.log(error)
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('id invalid format');
        return res.status(404).json({ msg: error.message })
    };
    //Validar que el proyecto con ese id existe
    const beProject = await ProjectM.findById(id);
    if (!beProject) {
        const error = new Error('id not found');
        return res.status(404).json({ msg: error.message })
    };
    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beProject.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('You are not the owner of this project');
        return res.status(401).json({ msg: error.message })
    }

    // Si booro un proyecto deben boorarse las tareas de TasksM

    try {

        await beProject.deleteOne();
        res.json({ msg: 'Project deleted successfully' });

    } catch (error) {
        console.log(error)
    }
};

const searchCoworker = async (req, res) => {
    const { email } = req.body

    const beuser = await UserM.findOne({ email }).select('-confirm -createdAt -password -token -updatedAt -__v')
    if (!beuser) {
        const error = new Error(`User ${email} not found`);
        return res.status(404).json({ msg: error.message })
    }

    res.json(beuser)
};

const addCoworker = async (req, res) => {

    const { id } = req.params

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('id invalid format');
        return res.status(404).json({ msg: error.message })
    };
    //Validar que el proyecto con ese id existe
    const beProject = await ProjectM.findById(id);
    if (!beProject) {
        const error = new Error('id not found');
        return res.status(404).json({ msg: error.message })
    };
    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beProject.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('You are not the owner of this project');
        return res.status(401).json({ msg: error.message })
    }

    // Validar que el usuario que busco por mail exiat en la base de datos
    const { email } = req.body
    const beuser = await UserM.findOne({ email }).select('-confirm -createdAt -password -token -updatedAt -__v')
    if (!beuser) {
        const error = new Error(`User ${email} not found`);
        return res.status(404).json({ msg: error.message })
    }

    // Validar que el mismo dueño del proyecto no se pueda agregar como coworker
    if (beProject.owner.toString() === beuser._id.toString()) {
        const error = new Error('The project owner cannot be added as a coworker');
        return res.status(401).json({ msg: error.message })
    }

    // validar si el correo que estoy agregando como coworker  ya es parte de los coworkers agreados
    if (beProject.coworkers.includes(beuser._id)) {
        const error = new Error('The user is currently a coworker');
        return res.status(401).json({ msg: error.message })
    }

    // Por fin si posan todas estas validaciones 
    try {
        beProject.coworkers.push(beuser._id);
        await beProject.save();
        res.json({ msg: 'coworker added successfully' })
    } catch (error) {
        console.log(error)
    }

};

// Para eliminar colaborador del proyecto

const deleteCoworker = async (req, res) => {
    const { id } = req.params

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('id invalid format');
        return res.status(404).json({ msg: error.message })
    };
    //Validar que el proyecto con ese id existe
    const beProject = await ProjectM.findById(id);
    if (!beProject) {
        const error = new Error('id not found');
        return res.status(404).json({ msg: error.message })
    };
    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beProject.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('You are not the owner of this project');
        return res.status(401).json({ msg: error.message })
    }
    // Despues de validar procedemos a eliminar un coworker
    try {
        beProject.coworkers.pull(req.body.id);
        await beProject.save();
        res.json({ msg: 'coworker deleted successfully' })
    } catch (error) {
        console.log(error)
    }

};


export {
    getProjects,
    newProject,
    getOneProject,
    editProject,
    deleteProject,
    searchCoworker,
    addCoworker,
    deleteCoworker,
}