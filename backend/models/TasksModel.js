import mongoose from 'mongoose'



const tasksSchema = mongoose.Schema({

    name: {
        type: 'string',
        trim: true,
        required: true
    },

    description: {
        type: 'string',
        trim: true,
        required: true
    },

    state: {
        type: Boolean,
        default: false,
    },

    deadline: {
        type: Date,
        require: true,
        default: Date.now(),
    },

    priority: {
        type: 'string',
        required: true,
        enum: ['Hight', 'Low', 'Medium'],
    },

    projectRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectM'
    },
}, {
    timestamps: true,
});

const TasksM = mongoose.model('TasksM', tasksSchema);

export default TasksM;