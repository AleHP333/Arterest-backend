const User = require("../../models/user")
const Router = require("express")
const router = Router();


router.post("/create", async (req, res) => {
    const {email, userName, password} = req.body
        try {    
            const newUser = await User.create({
                email,
                userName,
                password,
            })
        
            res.status(201).json({msg: "user created"})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Internal server error"})
        }
})


module.exports = router