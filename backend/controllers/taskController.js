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
        // almacenar el id del proyecto en la tarea (infor cruzada o relacionada)
        beProject.tasks.push(createTaskDb._id);
        await beProject.save();
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
        // console.log(beTask.projectRef.tasks)
        beTask.projectRef.tasks.pull(id);
        // await beTask.projectRef.save();
        // hay que elinar la tarea del Db de Tareas pero tbm hay que sacaral del [] de tareas del proyecto
        // await beTask.deleteOne()
        // un await seguido de otro bloquea por lo que haremos un Primise all settle
        await Promise.allSettled([await beTask.projectRef.save(), await beTask.deleteOne()])
        res.json({ msg: 'Task deleted successfully' })

    } catch (error) {
        console.log(error)
    }
};

const upDateStateTask = async (req, res) => {

    const { id } = req.params

    // validadr que el id sea en formato MONGOOSE ID
    const idFormatMongoose = mongoose.Types.ObjectId.isValid(id)
    if (idFormatMongoose == false) {
        const error = new Error('invalid format  => idFormatMongoose');
        return res.status(404).json({ msg: error.message })
    };

    const beTask = await TasksM.findById(id).populate('projectRef');

    // Cuando hago eñ pupulete en lugar de solo tomar los if de proyecto de referenica TOMA TODO el objeto del Project
    // por eso puedo sacar betask.projectRef.  ---->>  _id, name, state, owner y todo lo que tenga 

    if (!beTask) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    if (beTask.projectRef.owner.toString() !== req.userReq._id.toString() &&
        //dice si no es el dueño del proeycto quien quiere cambiar el estado de la tarea accion no valida 
        !beTask.projectRef.coworkers.some(coworker => coworker._id.toString() === req.userReq._id.toString())
        // aqui valida que si laguno de la lista de id de colaboradores coinciade con el  id del path y miega todo
        // Dice si no es colaborador del proeycto accion no valida
    ) {
        const error = new Error('You are not the owner || coworker of this project');
        return res.status(401).json({ msg: error.message })
    }

    try {
        beTask.state = !beTask.state
        beTask.completed = req.userReq._id
        await beTask.save()
        res.json(beTask)


    } catch (error) {
        console.log(error)
    }
};


export {
    newTask,
    getTasks,
    updateTask,
    deleteTask,
    upDateStateTask
}