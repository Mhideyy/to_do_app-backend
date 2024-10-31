const userModel = require("../models/user");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const reqUser = async (req, res) => {
    const { password, ...others} = req.body;
    const hashedPassowrd = bcrypt.hashSync(password, 10);
    const user = await userModel({...others, password: hashedPassowrd });
    try {
        await user.save();
       return res
                .status(201)
                .json({ message: "User created successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if(!user){
            return res
                        .status(404)
                        .json({ message: "User not found" });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch){
            return res
                        .status(400)
                        .json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        return res
                    .cookie("user_token", token)
                    .status(200)
                    .json({ message: "Logged in successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });
            console.log(error)
    }
};

const logoutUser = async (req, res) => {
    try {
        return res
                    .clearCookie("user_token")
                    .status(200)
                    .json({ message: "Logged out successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });        
    }
};


const authReg = async (req, res) => {
    const { fullname, email, username } = req.body;
        try {
            const isEmail = await userModel.findOne(email);

            if(isEmail){
               const token = jwt.sign( {id: user.id }, process.env.JWT_SECRET ) 
               return res
               .cookie("user_token", token)
               .status(200)
               .json({ message: "Logged in successfully" });
            }
            const user = await userModel({ fullname, email, username });
            await user.save();
            return res
                        .status(201)
                        .json({ message: "User created successfully" });   
        } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });           
        }
};

module.exports = { reqUser, loginUser, logoutUser, authReg };