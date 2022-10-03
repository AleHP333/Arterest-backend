const Product = require("../../models/product");
const Router = require("express")
const router = Router();
const passport = require("../../../config/passport");

//Al momento de comentar debería poder comprobar la existencia del usuario y si el token de usuario es 
//valido

router.get("/getPaintComments/:id", async (req, res) => {
    const { id } = req.params
    try {
        const paintComments = await Product.findOne({ _id: id }).select("comments").populate("comments.userId", {userName:1, userImage:1, isAdmin:1, isArtist:1, isBanned:1})
        res.status(200).json({success: "success", response: paintComments, msg: "disliked"})
    } catch (error) {
        res.status(500).json({success: false, msg: "Something is wrong :C"})
    }
})

router.route("/likeDislike/:id").get(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params
    const user = req.user._id
    try {
        const Paint = await Product.findOne({ _id: id });
        if(Paint.likes.includes(user)){
            let product = await Product.findOneAndUpdate({ _id: id }, { $pull: { likes: user }}, { new: true });
            console.log("disliked", product.likes)
            res.status(201).json({msgData: {success: "success", msg: "disliked"}, response: product.likes});
        } else {
            let product = await Product.findOneAndUpdate({ _id: id }, { $push: { likes: user }}, { new: true });
            console.log("liked", product.likes)
            res.status(201).json({ msgData: { status: "error", msg: "liked"}, response: product.likes});
        }
    } catch (error) {
        res.status(500).json({ msgData: { status: "error", msg: "The like wasn't added, try again"}})
    }
})

router.route("/addComment").post(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { paintId, comment } = req.body
    const user = req.user._id
    try {
        const newCommentAdd = await Product.findOneAndUpdate({ _id: paintId }, { $push: { comments: { comment: comment, userId: user, date: Date.now() }}})
        const newComment = await Product.findOne({ _id: paintId }).select("comments").then(response => response.populate("comments.userId", {userName:1, userImage:1, isAdmin:1, isArtist:1, isBanned:1}))
        res.status(201).json({ msgData: { status: "success", msg: "Thanks for comment"}, response: newComment})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status: "error", msg: "The comment wasn't added, try again"}})
    }
})

router.route("/modifyComment").put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { commentId, comment } = req.body
    try {
        const modifyComment = await Product.findOneAndUpdate({"comments._id": commentId}, { $set: {"comments.$.comment": comment, "comments.$.date": Date.now() }}, {new: true})
        const modifiedComments = await Product.findOne({"comments._id": commentId}).select("comments").then(response => response.populate("comments.userId", {userName:1, userImage:1, isAdmin:1, isArtist:1, isBanned:1}))
        res.status(201).json({ msgData: { status: "info", msg: "Comment edited successfully"}, response: modifiedComments})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status: "error", msg: "The comment wasn't edited, try again"}})
    }
})

router.route("/deleteComment").put(passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { commentId } = req.body
    try {
        const deletedComment = await Product.findOneAndUpdate({"comments._id": commentId}, {$pull: {comments: {_id: commentId}}}, {new: true})
        res.status(201).json({ msgData: { status: "warning", response: { deletedComment }, msg: "Comment deleted successfully"}})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msgData: { status: "error", msg: "The comment wasn't deleted, try again"}})
    }
})

module.exports = router