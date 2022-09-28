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
  router.put("/modifyUserProfile", async (req, res) => {
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
      const modifiedProduct = await User.findOneAndUpdate(
        { _id: _id },
        {
          userName: userName,
          userImage: userImage,
          names: names,
          surnames: surnames,
          country: country,
          city: city,
        },
        { new: true }
      );
        return res.status(201).json({ msgData: { status: "success", msg: "Product modified successfully"}})
    } catch (error) {
        return res.status(500).json({msgData:{ status: "error", msg: "Something is wrong"}})
    }
  });

  module.exports = router