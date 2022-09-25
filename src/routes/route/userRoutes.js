const { Router } = require("express");
const router = Router();
const User = require("../../models/user");


router.get('/', async (req, res) => {
    try {
      const users = await User.find()
      if (users.length === 0) throw new Error('Users is empty')
      res.json(users)
    } catch (error) {
      res.send(error.message)
    }
  })

  router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
      const userId = await User.findById(id)
      if (!userId) throw new Error('User not found')
      res.json(userId)
    } catch (error) {
      res.send(error.message)
    }
  })

  module.exports = router