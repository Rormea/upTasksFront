import UserM from "../models/UserModel.js";


const verifyBeUser = async (req, res) => {

    const { email } = req.body

    const beuser = await UserM.findOne({ email })

    if (beuser) {
        const error = new Error(`User ${beuser.email} already registered`);
        return res.status(400).json({ msg: error.message })
    }

};


export default verifyBeUser