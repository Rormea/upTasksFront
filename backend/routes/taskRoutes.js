import checkAuth from '../middleware/checkAuth.js';
import express from "express";
import {
    newTask,
    getTasks,
    updateTask,
    deleteTask,
    upDateStateTask
} from '../controllers/taskController.js'


const router = express.Router();


router.post('/', checkAuth, newTask)

router.route('/:id')
    .get(checkAuth, getTasks)
    .put(checkAuth, updateTask)
    .delete(checkAuth, deleteTask);

router.post('/state/:id', checkAuth, upDateStateTask)




export default router