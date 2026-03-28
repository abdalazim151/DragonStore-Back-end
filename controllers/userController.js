import { generateRefreshToken, generateToken } from "../services/auth.js"
import bcrypt from "bcrypt"
import User from "../models/user.js"
export const login =async (req, res) => {
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    console.log(user
    )
    if (!user || user.googleId
            || ! await bcrypt.compare(password, user.password))
        return res.status(400).json("Invalid email or password")
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
        message: "Success",
        accessToken,
        refreshToken
    });
}
export const register = async (req, res) => {
    console.log("innnnnnnnnnnnnnnnnn")
    const { firstName, lastName, email, password,roles } = req.body;
    let rolesArr
    
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) return res.status(400).json("User already exists");
    const imageUrl = req.file ? req.file.path : process.env.DEFAULT_IMAGE_URL;
    let temp = {
        firstName,
        lastName,
        email: email,
        password: password,
        img: imageUrl
        }
    if (roles) {
        rolesArr = roles.split(',')
        temp.role = rolesArr
    }
    const user = await User.create(temp);
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(201).json({
        message: "User Registered Successfully",
        accessToken,
        refreshToken
    });
};

