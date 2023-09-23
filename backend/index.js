import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';




const app = express();
app.use(express.json());

dotenv.config();

connectDB();

//Config CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        // console.log(origin)
        if (whitelist.includes(origin)) {
            //Puede consultar la API desde la URL
            callback(null, true)
        } else {
            // No está permitido consultar la API desde esa url
            callback(new Error('Error de Cors'));
        }
    }
};
app.use(cors(corsOptions));


//Routing configuration

app.use('/api/users', userRoutes)

app.use('/api/projects', projectRoutes)

app.use('/api/tasks', taskRoutes)







const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => { console.log(`server listening on port ${PORT} `) });

/////////////////////////////////////////////////////////////////
//                      SOCKET-IO  
/////////////////////////////////////////////////////////////////

import { Server } from 'socket.io';

const io = new Server(server, {
    pingTimeout: 6000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on('connection', (socket) => {
    console.log('Conect to socket io');

    //     // derfinir los eventos socket io
    socket.on('Open project', (projectId) => {
        socket.join(projectId)
        // console.log('projectId', projectId)
    });

    socket.on('new Task', (task) => {
        // console.log(task)
        const projectInSocketID = task.projectRef
        // console.log(projectInSocketID)
        socket.to(projectInSocketID).emit('added NewTask', task);
    })

    socket.on('remove Task', (task) => {
        const projectRef = task.projectRef
        // para que l sockect sea comunique con el id   del project que queremos
        socket.to(projectRef).emit('remove Task', task);
    });

    socket.on('update Task', (updatedTask) => {
        const projectInSocketID = updatedTask.projectRef._id
        // console.log(updatedTask)
        socket.to(projectInSocketID).emit('updated Task', updatedTask);
    })

    socket.on('stateComplete change', (taskWithStateChange) => {
        // console.log(taskWithStateChange)
        const projectInSocketID = taskWithStateChange.projectRef._id
        socket.to(projectInSocketID).emit('completed Task', taskWithStateChange);
    })
});

