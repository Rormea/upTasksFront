import jwt from "jsonwebtoken";
import User from '../models/UserModel.js'



const checkAuth = async (req, res, next) => {

    const headAuthToken = req.headers.authorization

    if (headAuthToken && headAuthToken.startsWith('Bearer')) {

        try {
            const token = headAuthToken.split(' ')[1];
            const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

            req.userReq = await User.findById(tokenDecoded.id).select(
                '-password -confirm -token -createdAt -updatedAt -__v'
            );
            return next();

        } catch (error) {
            return res.status(404).json({ msg: 'oken verification error' })
        }

    }

    if (!headAuthToken) {
        const error = new Error(`Token  not found`);
        return res.status(401).json({ msg: error.message })
    }

    next();
};









export default checkAuth