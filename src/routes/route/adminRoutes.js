const passport = require("../../../config/passport.js");
const { Router } = require("express");
const User = require("../../models/user.js");
const Product = require("../../models/product.js");
const router = Router();

//RECIVE LA ID DEL USUARIO Y UN BOOLEANO (TRUE: BANEADO, FALSE: NO BANEADO XD)
// ruta: /adminActions/banUser
router
  .route("/banUser")
  .put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { _id, isBanned } = req.body;
    try {
      const findUser = await User.findOne({ _id: req.body._id });
      if (!findUser) {
        return res.status(404).json({ msg: "User not found" });
      }
      if (isBanned === true) {
        findUser.isBanned = isBanned;
        await findUser.save();
        return res
          .status(200)
          .json({
            msgData: { success: "success", msg: "The user was banned" },
          });
      } else {
        findUser.isBanned = isBanned;
        await findUser.save();
        return res
          .status(200)
          .json({
            msgData: { success: "success", msg: "The user was unbanned" },
          });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });

router
  .route("/modifyProduct")
  .put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const {
      _id,
      userName,
      userImage,
      title,
      description,
      img,
      origin,
      technique,
      style,
      colors,
      releaseDate,
      price,
      stock,
      tags,
      likes,
      comments,
    } = req.body;

    console.log(req.body);
    try {
      const modifiedProduct = await Product.findOneAndUpdate(
        { _id: _id },
        {
          userName: userName,
          userImage: userImage,
          title: title,
          description: description,
          img: img,
          origin: origin,
          technique: technique,
          style: style,
          colors: colors,
          releaseDate: releaseDate,
          price: price,
          stock: stock,
          tags: tags,
          likes: likes,
          comments: comments,
        },
        { new: true }
      );

      res
        .status(201)
        .json({
          msgData: { success: "success", msg: "Product modified successfully" },
        });
    } catch (error) {
      res
        .status(500)
        .json({ msgData: { success: "error", msg: "Something is wrong" } });
    }
  });

router
  .route("/getAllUsers")
  .get(passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      let allUsers = await User.find();
      return res.status(200).json(allUsers);
    } catch (error) {
      console.log(error, "getAllUserserror");
      res.status(500).json({ msg: "Internal server error" });
    }
  });

module.exports = router;
