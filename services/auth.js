import jwt from "jsonwebtoken"
export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.Email, roles: user.roles },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRE }
    );
};
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
};