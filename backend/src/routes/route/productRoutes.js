const { Router } = require("express");
const router = Router();
const axios = require("axios");
const ProductTest = require("../../models/productTest");
const mockData = require("./data.json")

router.get("/allPaints", async (req, res) => {
    const {name, art} = req.query
    try {
        if(name){
            let products = await ProductTest.find({name: {$regex: '.*' + name + '.*', $options: "i"}})

            return res.status(200).json(products)
        }
        if(art){
            let products = await ProductTest.find({title: {$regex: '.*' + art + '.*', $options: "i"}})

            return res.status(200).json(products)
        }
        let products = await ProductTest.find()

        return res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
})

router.get("/createMassive", async (req, res) => {
    try {
        const subirTodo = await mockData.data.forEach( async (product) => {
            await ProductTest.create({
                userName: product.artist_name,
                userImage: product.avatar,
                title: product.artWork_name,
                description: product.description,
                img: product.image,
                origin: product.image,
                technique: product.artwork_medium,
                style: product.artwork_genre,
                colors: product.color,
                releaseDate: product.releaseDate,
                price: product.price,
                tags: product.tags,
            })
        })

        return res.status(201).json({msg: "success"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "Internal server error"})
    }
})

router.post("/createProducts", async (req, res) => {
    const {
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
        tags
    } = req.body
    try {
        const newProduct = await ProductTest.create({
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
            tags
        })
    
        res.status(201).json({msg: "Product created successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
})

module.exports = router

// userName: {type: String, required: true},
// userImage: {type: String, required: false},
// title: {type: String, required: true},
// description: {type: String, required: true},
// img: {type: String, required: true},
// origin: {type: String, required: true},
// technique: [{type: String, required: true}],
// style: {type: String, required: false},
// colors: [{type: String, required: false}],
// releaseDate: {type: Date, required: true},
// price: {type: Number, required: true},
// tags: [{type: String, required: true}]