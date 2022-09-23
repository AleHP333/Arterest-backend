const passport = require("../../../config/passportAdmin.js");
const { Router } = require("express");
const User = require("../../models/user.js");
const router = Router();

//RECIVE LA ID DEL USUARIO Y UN BOOLEANO (TRUE: BANEADO, FALSE: NO BANEADO XD)
// ruta: /adminActions/banUser
router.route("/banUser").put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id, isBanned } = req.body
    try {
        const findUser = await User.findOne({ _id: id })
        if(!findUser){return res.status(404).json({msg: "User not found"})}
        if(isBanned === true){
            findUser.isBanned = isBanned
            await findUser.save()
            return res.status(200).json({msgData: {success: "success", msg: "The user was banned"}})
        } else {
            findUser.isBanned = isBanned
            await findUser.save()
            return res.status(200).json({msgData: {success: "success", msg: "The user was unbanned"}})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
})

module.exports = router