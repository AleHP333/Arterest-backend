const { Router } = require("express");
const User = require("../../models/user.js");
const router = Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env
const passport = require("../../../config/passport");
const bcrypt = require("bcryptjs");
const sendVerification = require("../../../config/nodemailer");
const crypto = require("crypto");


router.post("/signIn", async (req, res) => {
    const { email, password, from } = req.body;
    try {
        const findUser = await User.findOne({ email: email });
        if(!findUser){
            return res.status(404).json({ msgData: { status: "error",  msg: "User doesn't exists"}})
        }
        if(from === "signIn"){
            if(findUser.verification === false){
                return res.status(401).json({ msgData: { status: "error",  msg: "The account isn't verificated. Please check your email and verify your account" }})
            }
            if(findUser.from.indexOf("signUp") === -1){
                return res.status(401).json({ msgData: { status: "error",  msg: "The account isn't verificated. Please check your email and verify your account" }})
            }
            const hashedPassword = findUser.password.filter((pass) => bcrypt.compareSync(password, pass))

            if(hashedPassword.length > 0){

                const userData = {
                    _id: findUser._id,
                    userName: findUser.userName,
                    userImage: findUser.userImage,
                    email: findUser.email,
                    from: findUser.from,
                    isAdmin: findUser.isAdmin,
                    isBanned: findUser.isBanned
                }

                const jwToken = jwt.sign({...userData}, SECRET_KEY, {
                    expiresIn: 60 * 60 * 24,
                })

                return res.status(200).json({msgData: {status: "success", msg: "Welcome"}, userData: userData, token: jwToken });
            } else {
                return res.status(401).json({ msgData: {status: "error", msg: "Invalid password"}})
            }
        } else {
            const hashedPassword = findUser.password.filter((pass) => bcrypt.compareSync(password, pass))

            if(hashedPassword.length > 0){

                const userData = {
                    _id: findUser._id,
                    userName: findUser.userName,
                    userImage: findUser.userImage,
                    email: findUser.email,
                    from: findUser.from,
                    isAdmin: findUser.isAdmin,
                    isBanned: findUser.isBanned
                }

                const jwToken = jwt.sign(userData, SECRET_KEY, {
                    expiresIn: 60 * 60 * 24,
                })
                return res.status(200).json({msgData: {status: "success", msg: "Welcome"}, userData: userData, token: jwToken });
            } else {
                return res.status(401).json({ msgData: {status: "error", msg: "The provided information isn't valid"}})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})

router.route("/signInToken").get(passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        console.log(req.user)
        if(req.user){
            const id = req.user._id
            const findUser = await User.findOne({ _id: id });

            return res.status(200).json({ msgData: { status: "success", msg: "Welcome"}, userData: findUser});
        } else {
            return res.status(400).json({ msgData: { status: "error", msg: "Token has expired"}});
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})

router.post("/signUp", async (req, res) => {
    const { email, userName, password, from } = req.body
    try {
        const uniqueString = crypto.randomBytes(15).toString("hex");
        const userFound = await User.findOne({ email: email })
        if(userFound){
            if(userFound.from.indexOf(from) !== -1){
                return res.status(401).json({ msgData: { status: "error", msg: "An user with the current email already exists"}})
            } else {
                const hashedPassword = await bcrypt.hashSync(password, 10)
                userFound.password.push(hashedPassword);
                
                if(from === "signUp"){
                    userFound.uniqueString = uniqueString
                    await userFound.save();
                    sendVerification(email, uniqueString)
                    return res.status(201).json({msgData: { status: "success", msg: "We sent you an email, check your inbox and verify your account" }})
                } else {
                    userFound.verification = true;
                    await userFound.save();
                    return res.status(201).json({msgData: { status: "success", msg: `We added sign In ${from} to your account` }})
                }
            }
        } else {
            const hashedPassword = await bcrypt.hashSync(password, 10)
            const newUser = await User.create({
                email,
                userName,
                password: [hashedPassword],
                verification: false,
                from: [from]
            });

            if(from === "signUp"){
                newUser.uniqueString = uniqueString
                await newUser.save()
                sendVerification(email, uniqueString)
                return res.status(201).json({ msgData: { status:"success", msg: "User Created. To continue please check your email and verify your account"}});
            } else {
                newUser.verification = true;
                await newUser.save();
                return res.status(201).json({ msgData: { status:"success", msg: "Thanks for register! Be free to use our website!"}});
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}})
    }
});

router.get("/verifyEmail/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const findUser = await User.findOne({ uniqueString: id })
        if(findUser){
            findUser.verification = true;
            findUser.from.push("signUp");
            await findUser.save();
            res.status(201).json({ msgData: { status: "success", msg: "Email verification completed. Thanks for register and be free to use our website!"} })
        } else {
            res.status(400).json({ msgData: { status: "error", msg: "Invalid verification code." }})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})

module.exports = router