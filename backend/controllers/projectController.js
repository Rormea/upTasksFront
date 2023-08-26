import mongoose from "mongoose";
import ProjectM from "../models/ProjectModel.js";
import TasksM from "../models/TasksModel.js";


const getProjects = async (req, res) => {

    const { userReq } = req

    const projects = await ProjectM.find().where('owner').equals(userReq);

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

    // Obtener tareas asociadas al proyecto

    const tasksInProject = await TasksM.find().where("projectRef").equals(beProject._id);

    res.json(
        {
            beProject,
            tasksInProject
        }
    );
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

    try {
        await beProject.deleteOne();
        res.json({ msg: 'Project deleted successfully' });

    } catch (error) {
        console.log(error)
    }
};

const addCoworker = async (req, res) => { };

const deleteCoworker = async (req, res) => { };

const getTask = async (req, res) => { };


export {
    getProjects,
    newProject,
    getOneProject,
    editProject,
    deleteProject,
    addCoworker,
    deleteCoworker,
    getTask
}