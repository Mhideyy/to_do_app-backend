const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    try {
        const user = await userModel.findById(id);
        if(!user){
            return res
                        .status(401)
                        .json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res
                        .status(401)
                        .json({ message: "Incorrect password" });
        }
        else if(newPassword === oldPassword){
            return res
                        .status(400)
                        .json({ message: "New password cannot be the same as the old password" });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await userModel.findByIdAndUpdate(id, {password:hashedPassword}, {new:true})
        res
            .status(202)
            .json({ message: "Password updated successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });        
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.user;
    try {
        await userModel.findByIdAndDelete(id);
        res
            .clearCookie("user_token")
            .status(204)
            .json({ message: "User deleted successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });        
    }
}

module.exports = {
                    updatePassword,
                    deleteUser
                };