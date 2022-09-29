const passport = require("../../../config/passport.js");
const { Router } = require("express");
const User = require("../../models/user.js");
const ProductArtist = require("../../models/productArtist.js");
const Request = require("../../models/request.js");
const Transaction = require("../../models/Transaction.js");
const router = Router();


router.route("/artistRequest").post(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const {
        message,
        url1,
        url2,
        url3
    } = req.body
    const isArtist = req.user.isArtist
    const user = req.user._id
    try {
        if(isArtist === true){
            return res.status(401).json({msgDate: {status: "info", msg: "You already are an Artist :)"}})
        }
        const find = await Request.findOne({ _id: user })

        if(find){
            return res.status(401).json({msgDate: {status: "warning", msg: "You have a pending artist request"}})
        }

        await Request.create({
            user: user,
            message,
            url1,
            url2,
            url3
        });

        return res.status(201).json({msgDate: {status: "info", msg: "Thank you for your interest! You will receive the request answer by email"}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "Internal server error"})
    }

})

router.route("/productRequest").post(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const {
        title,
        description,
        img,
        origin,
        technique,
        style,
        colors,
        releaseDate,
        price,
        tags
    } = req.body
    const isArtist = req.user.isArtist
    const user = req.user._id
    try {
        if(isArtist === false){
            res.status(401).json({msgDate: {status: "warning", msg: "You don't have permissions"}})
        }
        const newProduct = await ProductArtist.create({
            user: user,
            title,
            description,
            img,
            origin,
            technique,
            style,
            colors,
            releaseDate,
            price,
            tags
        })
    
        res.status(201).json({msgData: { status: "success", msg: "Product to post sent to the staff" }})
    } catch (error) {
        console.log(error)
        res.status(500).json({msgData: { status: "error", msg: "Failed to sent, try again" }})
    }
})

module.exports = router