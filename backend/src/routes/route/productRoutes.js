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
            let productsTitle = await ProductTest.find({title: {$regex: '.*' + art + '.*', $options: "i"}})
            console.log(productsTitle)
            let productsOrigin = await ProductTest.find({origin: {$regex: '.*' + art + '.*', $options: "i"}})
            let productsStyle = await ProductTest.find({style: {$regex: '.*' + art + '.*', $options: "i"}})
            //let productsColors = await ProductTest.find({})
            let productsTags = await ProductTest.find({tags: {$regex: '.*' + art + '.*', $options: "i"} })
            let productsColors = await ProductTest.find({colors: {$regex: '.*' + art + '.*', $options: "i"} })
            let productsTechnique = await ProductTest.find({technique: {$regex: '.*' + art + '.*', $options: "i"} })
            console.log(productsTags)
            let productsToMap = [...productsTitle, ...productsOrigin, ...productsStyle, ...productsTags, ...productsColors, ...productsTechnique]
            let products = await [...new Map(productsToMap.map((paint) => [paint["id"], paint])).values()]
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
        await mockData.data.forEach( async (product) => {
            await ProductTest.create({
                userName: product.artist_name,
                userImage: product.avatar,
                title: product.artWork_name,
                description: product.description,
                img: product.image,
                origin: product.country || "unknow",
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
// technique: [{type: String, required: true}], === ARRAY
// style: {type: String, required: false},
// colors: [{type: String, required: false}], === ARRAY
// releaseDate: {type: Date, required: true},
// price: {type: Number, required: true},
// tags: [{type: String, required: true}] === ARRAY