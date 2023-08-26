import mongoose from 'mongoose'



const projectSchema = mongoose.Schema({

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

    deadline: {
        type: Date,
        default: Date.now(),
    },

    client: {
        type: 'string',
        trim: true,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserM'
    },

    coworkers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserM'
        },
    ],

},
    {
        timestamps: true,
    }
);





const ProjectM = mongoose.model('ProjectM', projectSchema);

export default ProjectM;