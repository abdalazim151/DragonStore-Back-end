export const Resolve=function (req, res) {
    const { token, refreshToken } = req.user;

    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        accessToken: token,
        refreshToken: refreshToken
    });
}
import jwt from "jsonwebtoken"
import User from "../models/user.js"
export const auth = async (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ message: "no token" });
    try {
        const token = authorization.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;
        let v = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(v.id);
        console.log("v", v);


        if (!user)
            return res.status(500).json({ msg: "user not found" });
        req.role = user.role
        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}
export const allowedTo = (...roles) => {
    return (req, res, next) => {
        console.log("***********")
        console.log(roles)
        console.log("***********")
        console.log(req.role)
        console.log("***********")

        if (roles.includes(req.role))
            next()
        else return res.status(403).json({ msg: "not allowed" })
    }
}
export const refreshToken = async (req, res) => {
    try {
        let { refreshToken } = req.body
        let v = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        let user = await User.findById(v.id);
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        return res.status(200).json({ msg: "successs", token })
    }
    catch (err) {
        return res.status(401).json({ msg: "invalid token" })
    }
}