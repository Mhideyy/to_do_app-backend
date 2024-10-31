const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
    const {user_token} = req.cookies;
    if(!user_token){
        return res
                    .status(401)
                    .json({error: "User not authenticated"});
    }

    jwt.verify( user_token, process.env.JWT_SECRET, (error, info) => {
        if(error) return res
                            .status(403)
                            .json({message: "seme thing went wrong!!!"});
        req.user = info;
        next();
    })
};

module.exports = verify;