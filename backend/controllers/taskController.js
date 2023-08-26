import mongoose from "mongoose";
import TasksM from "../models/TasksModel.js";
import ProjectM from "../models/ProjectModel.js";



const newTask = async (req, res) => {

    const { projectRef } = req.body; // es el id del project de refeencia
    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(projectRef)
    if (idFormatMongoose == false) {
        const error = new Error('invalid format  => idFormatMongoose');
        return res.status(404).json({ msg: error.message })
    };
    //Validar que el proyecto con ese id existe
    const beProject = await ProjectM.findById(projectRef);
    if (!beProject) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message })
    };
    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beProject.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('Only the project owner can add tasks.');
        return res.status(401).json({ msg: error.message })
    }

    try {
        const { body } = req
        // const newTask = new TasksM(body)
        // const newTaskDb = await newTask.save() esta una forma abajo otra
        const createTaskDb = await TasksM.create(body)
        res.json(createTaskDb)
    } catch (error) {
        console.log(error)
    }
};


const getTasks = async (req, res) => {

    const { id } = req.params

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('invalid format  => idFormatMongoose');
        return res.status(404).json({ msg: error.message })
    };

    const beTask = await TasksM.findById(id).populate('projectRef');
    // Populate me cruza la información del proeycto de la referencia de la tarea que definí en el Modelo de tareas


    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beTask.projectRef.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('Only the project owner can view tasks.');
        return res.status(403).json({ msg: error.message })
    }

    if (!beTask) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    try {
        res.json(beTask)
    } catch (error) {
        console.log(error)
    }
};



const updateTask = async (req, res) => {

    const { id } = req.params

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('invalid format  => idFormatMongoose');
        return res.status(404).json({ msg: error.message })
    };

    const beTask = await TasksM.findById(id).populate('projectRef');

    if (!beTask) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    console.log(beTask.projectRef.owner)

    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beTask.projectRef.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('Only the project owner can view tasks.');
        return res.status(403).json({ msg: error.message })
    }

    try {
        const { name, priority, description, deadline, } = req.body

        beTask.name = name || beTask.name;
        beTask.priority = priority || beTask.priority;
        beTask.deadline = deadline || beTask.deadline;
        beTask.description = description || beTask.description;

        const updateTaskDb = await beTask.save();

        res.json(updateTaskDb)

    } catch (error) {
        console.log(error)
    }
};

const deleteTask = async (req, res) => {

    const { id } = req.params

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('invalid format  => idFormatMongoose');
        return res.status(404).json({ msg: error.message })
    };

    const beTask = await TasksM.findById(id).populate('projectRef');

    if (!beTask) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    // Validar que el usuario que solicita sea el mismo creador del proyecto
    if (beTask.projectRef.owner.toString() !== req.userReq._id.toString()) {
        const error = new Error('Only the project owner can view tasks.');
        return res.status(403).json({ msg: error.message })
    }

    try {
        await beTask.deleteOne()
        res.json({ msg: 'Task deleted successfully' })
    } catch (error) {
        console.log(error)
    }
};

const upDateStateTask = async (req, res) => { };


export {
    newTask,
    getTasks,
    updateTask,
    deleteTask,
    upDateStateTask
}