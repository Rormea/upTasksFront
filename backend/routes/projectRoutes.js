import {
    getProjects,
    newProject,
    getOneProject,
    editProject,
    deleteProject,
    searchCoworker,
    addCoworker,
    deleteCoworker,
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

router.post('/coworkers', checkAuth, searchCoworker);
router.post('/coworkers/:id', checkAuth, addCoworker);
router.delete('/coworkers/:id', checkAuth, deleteCoworker);

// router.get('/tasks/:id', checkAuth, getTask)





export default router

