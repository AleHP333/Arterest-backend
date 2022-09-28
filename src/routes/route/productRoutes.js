const { Router } = require("express");
const router = Router();
const axios = require("axios");
const Product = require("../../models/product");
const mockData = require("./data.json")

router.get("/getOnePaint/:id", async (req, res) => {
    const {id} = req.params
    try {
        let onePaint = await Product.findOne({_id: id})

        return res.status(200).json(onePaint);
    } catch (error) {
        res.status(500).json({msg: "Internal server error"})
    }
})

router.get("/allpaints", async (req, res) => {
    const {name, art} = req.query
    try {
        if(name){
            let products = await Product.find({userName: {$regex: '.*' + name + '.*', $options: "i"}})

            return res.status(200).json(products)
        }
        if(art){
            let productsUserName = await Product.find({userName: {$regex: '.*' + art + '.*', $options: "i"}})
            let productsTitle = await Product.find({title: {$regex: '.*' + art + '.*', $options: "i"}})
            console.log(productsTitle)
            let productsOrigin = await Product.find({origin: {$regex: '.*' + art + '.*', $options: "i"}})
            let productsStyle = await Product.find({style: {$regex: '.*' + art + '.*', $options: "i"}})
            //let productsColors = await ProductTest.find({})
            let productsTags = await Product.find({tags: {$regex: '.*' + art + '.*', $options: "i"} })
            let productsColors = await Product.find({colors: {$regex: '.*' + art + '.*', $options: "i"} })
            let productsTechnique = await Product.find({technique: {$regex: '.*' + art + '.*', $options: "i"} })
            console.log(productsTags)
            let productsToMap = [...productsUserName, ...productsTitle, ...productsOrigin, ...productsStyle, ...productsTags, ...productsColors, ...productsTechnique]
            let products = await [...new Map(productsToMap.map((paint) => [paint["id"], paint])).values()]
            return res.status(200).json(products)
        }
        let products = await Product.find()
        return res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
})

router.get("/autocomplete", async (req, res) => {
    const {name, art} = req.query
    try {
        if(name){
            let products = await Product.find({userName: {$regex: '.*' + name + '.*', $options: "i"}})

            return res.status(200).json(products)
        }
        if(art){
            let productsUserName = await Product.find({userName: {$regex: '.*' + art + '.*', $options: "i"}})
            let productsTitle = await Product.find({title: {$regex: '.*' + art + '.*', $options: "i"}})
            console.log(productsTitle)
            let productsOrigin = await Product.find({origin: {$regex: '.*' + art + '.*', $options: "i"}})
            let productsStyle = await Product.find({style: {$regex: '.*' + art + '.*', $options: "i"}})
            //let productsColors = await ProductTest.find({})
            let productsTags = await Product.find({tags: {$regex: '.*' + art + '.*', $options: "i"} })
            let productsColors = await Product.find({colors: {$regex: '.*' + art + '.*', $options: "i"} })
            let productsTechnique = await Product.find({technique: {$regex: '.*' + art + '.*', $options: "i"} })
            console.log(productsTags)
            let productsToMap = [...productsUserName, ...productsTitle, ...productsOrigin, ...productsStyle, ...productsTags, ...productsColors, ...productsTechnique]
            let products = await [...new Map(productsToMap.map((paint) => [paint["id"], paint])).values()]
            let sorted = products.sort((a, b) => a.likes.length - b.likes.length).reverse()
            let autocompleted = sorted.slice(0, 5)
            return res.status(200).json(autocompleted)
        }
        let autocompleted = await Product.find()
        return res.status(200).json(autocompleted)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
})


router.get("/getFiveRandom", async (req, res) => {
    try {
        const fiveRandom = await Product.aggregate([{ $sample: { size: 5 } }])
        return res.status(200).json(fiveRandom);
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "Internal server error"})
    }
})

//NO USAR ESTA RUTA (Solo para crear muchos a la vez mediante un .json local)
router.get("/createMassive", async (req, res) => {
    try {
        await mockData.data.forEach( async (product) => {
            await Product.create({
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
        const newProduct = await Product.create({
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