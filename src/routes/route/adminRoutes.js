const passport = require("../../../config/passport.js");
const { Router } = require("express");
const User = require("../../models/user.js");
const Product = require("../../models/product.js");
const Request = require("../../models/request.js");
const ProductArtist = require("../../models/productArtist.js");
const ProductTest = require("../../models/productTest.js")
const sendVerification = require("../../../config/nodemailer.js");
const router = Router();

//RECIVE LA ID DEL USUARIO Y UN BOOLEANO (TRUE: BANEADO, FALSE: NO BANEADO XD)
// ruta: /adminActions/banUser
router
  .route("/banUser")
  .put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { _id, isBanned } = req.body;
    const isAdmin = req.user.isAdmin 
    try {
        if(isAdmin === false){
          return res.status(401).json({msgDate: {status: "error", msg: "You don't have permissions"}})
        }
        const findUser = await User.findOne({ _id: req.body._id })
        if(!findUser){return res.status(404).json({msgData:{status: "error", msg: "User not found"}})}
        if(isBanned === true){
            findUser.isBanned = isBanned
            await findUser.save()
            return res.status(200).json({msgData: {status: "success", msg: "The user was banned"}})
        } else {
            findUser.isBanned = isBanned
            await findUser.save()
            return res.status(200).json({msgData: {status: "success", msg: "The user was unbanned"}})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({msgData:{ status: "error", msg: "Internal server Error"}})    
    }
});

router
  .route("/adminUser")
  .put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { _id  } = req.body;
    const isAdmin = req.user.isAdmin 
    try {
        if(isAdmin === false){
          return res.status(401).json({msgDate: {status: "error", msg: "You don't have permissions"}})
        }
        const findUser = await User.findOne({ _id: req.body._id })
        if(!findUser){return res.status(404).json({msgData:{status: "error", msg: "User not found"}})}
        if(findUser.isAdmin === true){
            findUser.isAdmin = !findUser.isAdmin
            await findUser.save()
            return res.status(200).json({msgData: {status: "success", msg: "The user was banned"}})
        } else {
            findUser.isAdmin = !findUser.isAdmin
            await findUser.save()
            return res.status(200).json({msgData: {status: "success", msg: "The user was unbanned"}})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({msgData:{ status: "error", msg: "Internal server Error"}})    
    }
});

router
  .route("/artistUser")
  .put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { _id, isArtist, email } = req.body;
    const isAdmin = req.user.isAdmin
    console.log(isArtist)
    try {
        if(isAdmin === false){
          return res.status(401).json({msgDate: {status: "error", msg: "You don't have permissions"}})
        }
        const findUser = await User.findOne({ _id: req.body._id })
        if(!findUser){return res.status(404).json({msgData:{status: "error", msg: "User not found"}})}
        if(isArtist === true){
            findUser.isArtist = isArtist
            await findUser.save()
            sendVerification(email, null, 1)
            return res.status(200).json({msgData: {status: "success", msg: `The user ${findUser.userName} turned to Artist`}})
        } else {
            findUser.isArtist = isArtist
            await findUser.save()
            return res.status(200).json({msgData: {status: "info", msg: `User ${findUser.userName}: Request declined`}})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({msgData:{ status: "error", msg: "Internal server Error"}})    
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
        return res.status(201).json({ msgData: { status: "success", msg: "Product modified successfully"}})
    } catch (error) {
        return res.status(500).json({msgData:{ status: "error", msg: "Something is wrong"}})
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
        return res.status(500).json({msgData:{ status: "error", msg: "Something is wrong"}});
    }
  });

router.route("/getArtistRequest").get(async (req, res) => {
  try {
    let requests = await Request.find().populate("user", {userName:1, userImage:1, email:1});
    return res.status(200).json(requests)
  } catch (error) {
    console.log(error, "getAllUserserror");
    return res.status(500).json({msgData:{ status: "error", msg: "Something is wrong"}});
  }
})

router.route("/getArtRequest").get(async (req, res) => {
  try {
    let requests = await ProductArtist.find().populate("user", {userName:1, userImage:1, email:1});
    return res.status(200).json(requests)
  } catch (error) {
    return res.status(500).json({msgData:{ status: "error", msg: "Something is wrong"}});
  }
})

router.route("/approveArt").post(async (req, res) => {
  const { user, paint_id, approve, email } = req.body
  try {
    if(approve === false){
      const deleted = await ProductArtist.deleteOne({ _id: paint_id})
      console.log("entro acá", deleted)
      return res.status(201).json({ msgData: { status: "info", msg: "Art Request Disapproved"}})
    } else {
      const approved = await ProductArtist.findOne({ _id: paint_id })
      const product = await ProductTest.create({
        user: user,
        title: approved.title,
        description: approved.description,
        img: approved.img,
        origin: approved.origin,
        technique: approved.technique,
        style: approved.style,
        colors: approved.colors,
        releaseDate: approved.releaseDate,
        price: approved.price,
        tags: approved.tags
      })
      console.log("entro acá", deleted)
      return res.status(201).json({ msgData: { status: "success", msg: "Product Approved"}})
    }
  } catch (error) {
    
  }
})

module.exports = router;
