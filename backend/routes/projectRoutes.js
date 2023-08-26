import {
    getProjects,
    newProject,
    getOneProject,
    editProject,
    deleteProject,
    addCoworker,
    deleteCoworker,
    getTask
} from '../controllers/projectController.js';
import checkAuth from '../middleware/checkAuth.js';
import express from "express";

const router = express.Router();


router.route('/')
    .get(checkAuth, getProjects)
    .post(checkAuth, newProject);

router.route('/:id')
    .get(checkAuth, getOneProject)
    .put(checkAuth, editProject)
    .delete(checkAuth, deleteProject)

router.post('/add-coworker/id', checkAuth, addCoworker);
router.post('/add-coworker/id', checkAuth, deleteCoworker);

router.get('/tasks/:id', checkAuth, getTask)





export default router

