import mongoose from "mongoose"
import bcrypt from "bcrypt"
const UserSchema =new  mongoose.Schema({
    firstName: {
        type: String,
        required: true

    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "un valid Emial"]

    },
    password: {
        type: String,
        minlength: [6, "short pass"],
        required: function () { return !this.googleId; }
    },
    img: {
        type: String
    },
    roles: {
        type: [String],
        enum: ['user', 'seller', 'admin'],
        default: ['user']
    },
    googleId: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
UserSchema.pre("save", async function () {
    if(this.password)
    this.password = await bcrypt.hash(this.password, 10);
})


UserSchema.methods.comparePassword = async (candidatePassowrd) => {
if (!this.password) return
   return await bcrypt.compare(this.password,candidatePassowrd)
}
const User = mongoose.model("users", UserSchema)
export default User;