const { Router } = require("express");
const router = Router();
const User = require("../../models/user");
const passport = require("../../../config/passport.js");


router.get('/', async (req, res) => {
    try {
      const users = await User.find()
      if (users.length === 0) throw new Error('Users is empty')
      res.json(users)
    } catch (error) {
      res.send(error.message)
    }
  })

  router
  .route('/:id')
  .get(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const  id  = req.user._id
    try {
      const userId = await User.findOne({_id: id})
      if (!userId) throw new Error('User not found')
      res.json(userId)
    } catch (error) {
      res.send(error.message)
    }
  })

  router
  .route("/modifyUserProfile")
  .put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id
    const {
      _id,
      userName,
      userImage,
      names,
      surnames,
      country,
      city,
      
    } = req.body;
    try {
      const modifiedUser = await User.findOne(
        { _id: user }

        );
      
          modifiedUser.userName= userName,
          modifiedUser.userImage= userImage,
          modifiedUser.names= names,
          modifiedUser.surnames= surnames,
          modifiedUser.country= country,
          modifiedUser.city= city,
    
        await modifiedUser.save()
        console.log(modifiedUser)
        return res.status(201).json({userData: modifiedUser, msgData: { status: "success", msg: "User modified successfully"}})
      } catch (error) {
        return res.status(500).json({msgData:{ status: "error", msg: "Something is wrong"}})
    }
  });

  module.exports = router