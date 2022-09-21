const Product = require("../../models/product");
const Router = require("express")
const router = Router();

const verifyToken = "hola"

//Al momento de comentar debería poder comprobar la existencia del usuario y si el token de usuario es 
//valido

router.route("/likeDislike/:id").get( async (req, res) => {
    const { id } = req.params
    const { user } = req.body

    try {
        const Paint = await Product.findOne({ _id: id });
        if(Paint.likes.includes(user)){
            let product = await Product.findOneAndUpdate({ _id: id }, { $pull: { likes: user }}, { new: true });
            res.status(201).json({success: true, response: product.likes, msg: "disliked"});
        } else {
            let product = await Product.findOneAndUpdate({ _id: id }, { $push: { likes: user }}, { new: true });
            res.status(201).json({success: true, response: product.likes, msg: "liked"});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, msg: "The like wasn't added, try again"})
    }
})

router.route("/addComment").post( async (req, res) => {
    return res.status(400).send("hasta acá llega")
    const { paintId, comment } = req.body
    const { user } = req.body
    try {
        const newComment = await Product.findOneAndUpdate({ _id: paintId }, { $push: { comments: { comment: comment, userId: user, date: Date.now() }}}).populate("comments.userId", {userName:1})
        res.status(201).json({success: "success", response: newComment, msg: "Thanks for comment"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: "error", msg: "The comment wasn't added, try again"})
    }
})

router.route("/modifyComment").put( async (req, res) => {
    const { commentId, comment } = req.body
    const { user } = req.body
    console.log("SOY EL COMMENT ID", commentId)
    try {
        const modifiedComment = await Product.findOneAndUpdate({"comments._id": commentId}, { $set: {"comments.$.comment": comment, "comments.$.date": Date.now() }}, {new: true})
        console.log(modifiedComment)
        res.status(201).json({ success: "success", response: modifiedComment, message: "Comment edited successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: "error", msg: "The comment wasn't edited, try again"})
    }
})

router.route("/deleteComment").delete( async (req, res) => {
    const { commentId } = req.body
    try {
        const deletedComment = await Product.findOneAndUpdate({"comments._id": commentId}, {$pull: {comments: {_id: commentId}}}, {new: true})
        res.status(201).json({ success: "success", response: { deletedComment }, message: "Comment deleted successfully"})
    } catch (error) {
        res.status(500).json({success: "error", msg: "The comment wasn't deleted, try again"})
    }
})

module.exports = router