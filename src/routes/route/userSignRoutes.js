const { Router } = require("express");
const User = require("../../models/user.js");
const router = Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env
const passport = require("../../../config/passport");
const bcrypt = require("bcryptjs");
const sendVerification = require("../../../config/nodemailer");
const crypto = require("crypto");
const Transaction = require("../../models/Transaction.js");
const Password = require("../../models/password")


router.post("/signIn", async (req, res) => {
    const { email, password, from } = req.body;
    try {
        const findUser = await User.findOne({ email: email }).populate("purchase_order.products.publicationId");
        if(!findUser){
            return res.status(404).json({ msgData: { status: "error",  msg: "User doesn't exists"}})
        }
        const userTransactions = await Transaction.find({ buyer: findUser._id }).populate("transaction.product")
        if(findUser.isBanned === true){
            return res.status(401).json({ msgData: { status: "warning", msg: "This account was banned"}})
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
                    isArtist: findUser.isArtist,
                    isAdmin: findUser.isAdmin,
                    isBanned: findUser.isBanned
                }

                const jwToken = jwt.sign({...userData}, SECRET_KEY, {
                    expiresIn: 60 * 60 * 24,
                })

                return res.status(200).json({msgData: {status: "success", msg: `Welcome ${findUser.userName}`}, userData: {...userData, country: findUser.country, names: findUser.names, surnames: findUser.surnames, city: findUser.city, history: userTransactions }, token: jwToken });
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
                    isArtist: findUser.isArtist,
                    isAdmin: findUser.isAdmin,
                    isBanned: findUser.isBanned
                }

                const jwToken = jwt.sign(userData, SECRET_KEY, {
                    expiresIn: 60 * 60 * 24,
                })
                return res.status(200).json({msgData: {status: "success", msg: `Welcome ${findUser.userName}`}, userData: {...userData, country: findUser.country, names: findUser.names, surnames: findUser.surnames, city: findUser.city, history: userTransactions}, token: jwToken });
            } else {
                return res.status(401).json({ msgData: {status: "error", msg: "The provided information isn't valid"}})
            }
        }
    } catch (error) {
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})

router.route("/signInToken").get(passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        if(req.user){
            const id = req.user._id
            const findUser = await User.findOne({ _id: id })
            const userTransactions = await Transaction.find({ buyer: findUser._id }).populate("transaction.product")
            const userData = {
                _id: findUser._id,
                userName: findUser.userName,
                userImage: findUser.userImage,
                email: findUser.email,
                from: findUser.from,
                isArtist: findUser.isArtist,
                isAdmin: findUser.isAdmin,
                isBanned: findUser.isBanned
            }

            return res.status(200).setHeader('Last-Modified', (new Date()).toUTCString()).json({ msgData: { status: "success", msg: `Welcome ${findUser.userName}`}, userData: {...userData, country: findUser.country, names: findUser.names, surnames: findUser.surnames, city: findUser.city, history: userTransactions }});
        } else {
            return res.status(400).json({ msgData: { status: "error", msg: "Token has expired"}});
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})

router.post("/signUp", async (req, res) => {
    const { email, userName, password, from, userImage } = req.body
    try {
        const uniqueString = crypto.randomBytes(15).toString("hex");
        const randomNum = Math.floor(Math.random() * 10000)
        console.log(randomNum)
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
                    sendVerification(email, uniqueString, 0)
                    return res.status(201).json({msgData: { status: "success", msg: "We sent you an email, check your inbox and verify your account" }})
                } else {
                    userFound.verification = true;
                    await userFound.save();
                    return res.status(201).json({msgData: { status: "success", msg: `We added sign In ${from} to your account` }})
                }
            }
        } else {
            const userNameRandom = userName + randomNum
            const findedUserByUserName = await User.findOne({userName: userNameRandom})
            if(findedUserByUserName){
                return res.status(401).json({ msgData: { status: "error", msg: "An user with the current userName already exists"}})
            }
            const hashedPassword = await bcrypt.hashSync(password, 10)
            const newUser = await User.create({
                email,
                userName: userNameRandom,
                password: [hashedPassword],
                verification: false,
                from: [from]
            });

            if(from === "signUp"){
                newUser.uniqueString = uniqueString
                await newUser.save()
                sendVerification(email, uniqueString, 0)
                return res.status(201).json({ msgData: { status:"success", msg: "User Created. To continue please check your email and verify your account"}});
            } else {
                newUser.verification = true;
                newUser.userImage = userImage
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

router.route("/passwordRecovery").post(async (req, res) => {
    const { email } = req.body;
    try {
        if(!email){
            return res.status(404).json({ msgData: { status: "warning", msg: "Please, write an e-mail" }})
        }
        const findUser = await User.findOne({ email: req.body.email});
        console.log(findUser)
        if(!findUser){
            return res.status(404).json({ msgData: { status: "warning", msg: "The user with the email wasn't registered" }})
        }
        if(findUser && findUser.from.indexOf("google") !== -1){
            return res.status(404).json({ msgData: { status: "warning", msg: "The user was registered by google, just login with google" }})
        }
        const passwordRequest = await Password.findOne({ user: findUser._id})
        if(passwordRequest){
            await Password.deleteOne({ user: findUser._id})
        }
        const jwToken = jwt.sign({email: email}, SECRET_KEY, {
            expiresIn: 60*60*24
        })
        const String = crypto.randomBytes(15).toString("hex");
        await Password.create({
            email: email,
            uniqueString: jwToken,
            code: String
        })

        sendVerification(email, String, 2);

        return res.status(201).json({msgData: { status: "success", msg: `We sent an email to ${email}`}})
     
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})

router.route("/verifyPassCode").post(async (req, res) => {
    const { code } = req.body
    console.log(code)
    try {
        const codeDb = await Password.findOne({code: code})
        console.log(codeDb)
        if(!codeDb){
            return res.status(404).json({ msgData: { status:"error", msg: "The code doesn't exists"}})
        }
        const verify = await jwt.verify(codeDb.uniqueString, SECRET_KEY);
        if(!verify){
            return res.status(401).json({ msgData: { status:"error", msg: "Code has expired"}})
        } else {
            return res.status(200).json({msgData: { status: "success", msg: "The code is valid, change your password"}})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})

router.route("/changePassword").put(async (req, res) => {
    const { code, password } = req.body
    try {
        const codeDb = await Password.findOne({code: code})
        if(!codeDb){
            return res.status(404).json({ msgData: { status:"error", msg: "The code doesn't exists"}})
        }
        const verify = await jwt.verify(codeDb.uniqueString, SECRET_KEY);
        if(!verify){
            return res.status(401).json({ msgData: { status:"error", msg: "Code has expired"}})
        } else {
            const hashedPassword = await bcrypt.hashSync(password, 10);
            const findedUser = await User.findOne({ email: codeDb.email });
            console.log(findedUser)
            await findedUser.password.push(hashedPassword);
            await findedUser.save();
            await Password.deleteOne({code: code})
            return res.status(201).json({msgData: { status: "success", msg: "Password changed successfully"}})
        }
    } catch (error) {
        res.status(500).json({ msgData: { status:"error", msg: "Internal Server Error"}});
    }
})


module.exports = router
