import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = mongoose.Schema({

    name: {
        type: 'string',
        trim: true,
        required: true
    },

    password: {
        type: 'string',
        trim: true,
        required: true
    },

    email: {
        type: 'string',
        trim: true,
        required: true,
        unique: true
    },

    token: {
        type: 'string',
    },

    confirm: {
        type: 'boolean',
        default: false
    }
}, {
    timestamps: true
});

/// HASHEO
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) next();

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});


// AGRGAR METHOD

//verifca pasa hasheado
userSchema.methods.verifyPass = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
}; // retorna T ou F







const UserM = mongoose.model('UserM', userSchema);

export default UserM;