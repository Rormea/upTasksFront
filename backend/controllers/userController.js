import UserM from "../models/UserModel.js";
import { v4 as UID4 } from 'uuid';
import generateJWT from '../helpers/generateJWT.js'
import { sinUpEmail, changePassword } from "../helpers/nodeMailer.js";


// import verifyBeUser from '../helpers/verifyBeUser.js'



///////////////////////////////////////////////////////////////////////
///////////////////////// CREAR USUARIO  //////////////////////////////
///////////////////////////////////////////////////////////////////////
const newUser = async (req, res) => {

    const { body } = req

    // verification si usuario existe
    const { email } = req.body
    const beuser = await UserM.findOne({ email })
    if (beuser) {
        const error = new Error(`User ${beuser.email} already registered`);
        return res.status(400).json({ msg: error.message })
    }


    try {

        const user = new UserM(body)
        // estoy pasando los datos del body por la instancia del modelo para que agregue los datos

        user.token = UID4();
        //le agrega el token al modelo

        // const userSaveDb = await user.save();
        await user.save();
        // lo grabamos en la DB
        // res.json(userSaveDb);

        //Enviar email de confirmacion
        sinUpEmail({
            email: user.email,
            name: user.name,
            token: user.token
        });

        res.json({ msg: "user created successfully, check your email to confirm your account." });

    } catch (error) {
        console.log(error);
    }
};

///////////////////////////////////////////////////////////////////////
///////////////////////// AUTH  //////////////////////////////
///////////////////////////////////////////////////////////////////////

const auth = async (req, res) => {

    //1 comprobar si el usuario existe
    const { email, password } = req.body
    const beuser = await UserM.findOne({ email })
    if (!beuser) {
        const error = new Error(`User ${email} not found`);
        return res.status(404).json({ msg: error.message })
    }

    //2 comprobar si el usuario esta confirmado
    if (!beuser.confirm) {
        const error = new Error(`User account  not confirmed`);
        return res.status(404).json({ msg: error.message })
    }

    //3 comprobar su password
    if (await beuser.verifyPass(password)) {

        res.json({
            name: beuser.name,
            email: beuser.email,
            token: generateJWT(beuser.id)
        })
    } else {
        const error = new Error(`Password incorrect`);
        return res.status(404).json({ msg: error.message })
    }

};


///////////////////////////////////////////////////////////////////////
///////////////////////// userConfirm //////////////////////////////
///////////////////////////////////////////////////////////////////////

const userConfirm = async (req, res) => {

    const { token } = req.params
    const beuser = await UserM.findOne({ token })
    if (!beuser) {
        const error = new Error(`Token  not found`);
        return res.status(404).json({ msg: error.message })
    }

    try {

        beuser.confirm = true
        beuser.token = ""
        await beuser.save();
        res.json({ msg: 'user confirmed successfully' })

    } catch (error) {
        console.log(error)
    }
};

///////////////////////////////////////////////////////////////////////
///////////////////////// RECUPERAR PASSWORD  //////////////////////////////
///////////////////////////////////////////////////////////////////////

// Ve si el usuario existe , si es asi le genera un nuevo token que lo va enviar por correo

const recoveryPass = async (req, res) => {

    //1 comprobar si el usuario existe
    const { email } = req.body
    const beuser = await UserM.findOne({ email })
    if (!beuser) {
        const error = new Error(`User ${beuser.email} not found`);
        return res.status(404).json({ msg: error.message })
    }

    try {
        beuser.token = UID4();
        await beuser.save();

        //Enviar email de confirmacion
        changePassword({
            email: beuser.email,
            name: beuser.name,
            token: beuser.token
        });


        res.json({ msg: 'We have sent an email with instructions' })
    } catch (error) {
        console.log(error)
    }
};

///////////////////////////////////////////////////////////////////////
///////////////////////// verificar TOKEN para crear nueva PASS  //////
///////////////////////////////////////////////////////////////////////

// el susurio va confirmar su token por params

const verifyToken = async (req, res) => {

    const { token } = req.params;
    const beuser = await UserM.findOne({ token })
    if (beuser) {
        res.json({ msg: 'valid token user exists' });
    } else {
        const error = new Error(`Token  not found`);
        return res.status(404).json({ msg: error.message })
    }
};

///////////////////////////////////////////////////////////////////////
///////////////////////// Generar nuevo PAssword /////////////// //////
///////////////////////////////////////////////////////////////////////

// usurio confirma su token params, y le generamos un nuevo pass

const newPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;


    const beuser = await UserM.findOne({ token })
    if (beuser) {

        beuser.password = password
        beuser.token = ""
        await beuser.save();
        res.json({ msg: 'Password changed successfully' })

    } else {
        const error = new Error(`Token  not found`);
        return res.status(404).json({ msg: error.message })
    }
};

///////////////////////////////////////////////////////////////////////
///////////////////////// PERFIL DE USUARIO  //////////////////////////////
///////////////////////////////////////////////////////////////////////

const userProfile = async (req, res) => {

    const { userReq } = req

    res.json(userReq);

};








export {
    newUser,
    auth,
    userConfirm,
    recoveryPass,
    verifyToken,
    newPassword,
    userProfile
}