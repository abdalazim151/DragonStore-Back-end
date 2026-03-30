import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
    let { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "no token" });
    }

    try {
        const token = authorization.startsWith('Bearer ')
            ? authorization.split(' ')[1]
            : authorization;

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }

        req.roles = user.roles;
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: err.message });
    }
};

export const allowedTo = (...roles) => {
    return (req, res, next) => {
        const isAllowed = req.roles.some(role => roles.includes(role));

        if (isAllowed) {
            return next();
        }

        return res.status(403).json({ msg: "forbidden" });
    };
};