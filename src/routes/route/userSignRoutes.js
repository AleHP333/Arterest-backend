const { Router } = require("express");
const User = require("../../models/user.js");
const router = Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env
const passport = require("passport");
const bcrypt = require("bcryptjs");
const sendVerification = require("../../../config/nodemailer");
const crypto = require("crypto");


router.post("/signIn", async (req, res) => {
    const { email, password } = req.body;
    try {
        const findUser = await User.findOne({ email: email });
        if(!findUser){
            return res.status(404).json({ msg: "User doesn't exists"})
        }
        console.log(findUser.verification)
        if(findUser.verification === false){
            return res.status(401).json({ msg: "The account isn't verificated. Please check your email and verify your account" })
        }
        const hashedPassword = await bcrypt.compareSync(password, findUser.password)
        if(hashedPassword === true){
            const jwToken = jwt.sign({...findUser}, SECRET_KEY, {
                expiresIn: 60 * 60 * 24,
              })

            return res.status(200).json({msg: "Welcome", userData: findUser, token: jwToken });
        } else {
            return res.status(401).json({msg: "Invalid password"})
        }
    } catch (error) {
        res.status(500).json({msg: "Internal server error"});
    }
})

router.route("/signInToken").get(passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        if(req.user){
            const {email} = req.user
            const findUser = await User.findOne({ email: email });

            return res.status(200).json({msg: "Welcome", userData: findUser});
        } else {
            return res.status(400).json({msg: "Token has expired"});
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Internal Server Error"});
    }
})

router.post("/signUp", async (req, res) => {
    const {
        email,
        userName,
        password,
    } = req.body
    try {
    const userFound = await User.findOne({ email: email })
    console.log(User);
    if(userFound){
        return res.status(401).json({msg: "An user with the current email already exists"})
    } else {
        const uniqueString = crypto.randomBytes(15).toString("hex");
        const hashedPassword = await bcrypt.hashSync(password, 10)
        const newUser = await User.create({
            email,
            userName,
            password: hashedPassword,
            verification: false,
            uniqueString: uniqueString
        });

        console.log(newUser)
        sendVerification(email, uniqueString)
        return res.status(201).json({ msg: "User Created. To continue please check your email and verify your account"});
    }

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal Server Error"})
    }
});

router.get("/verifyEmail/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const findUser = await User.findOne({ uniqueString: id })
        if(findUser){
            findUser.verification = true;
            await findUser.save();
            res.status(201).json({ msg: "Email verification completed. Thanks for register and be free to use our website!" })
        } else {
            res.status(400).json({ msg: "Invalid verification code." })
        }
    } catch (error) {
        res.status(500).json({msg: "Internal Server Error"});
    }
})

module.exports = router