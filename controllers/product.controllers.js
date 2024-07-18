import Product from "../models/products.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'
import User from '../models/user.models.js'
import ApiFeatures from "../utils/apiFeatures.js";

// Create Product->
export const createProduct = asyncErrorHandler(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Avatar Required!", 400));
    }
    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported", 400));
    }
    const { name, category, brand, price, discount, stock, rating, reviews, description, features, warranty, width, height, depth, weight, color } = req.body;
    if (!name || !category || !price || !brand || !discount || !stock || !rating || !reviews || !description || !features || !warranty || !width || !height || !depth || !weight || !color) {
        return next(new ErrorHandler("Fill the credentials", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary Error"
        );
        return next(
            new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
        );
    }

    const product = new Product({
        name,
        category,
        brand,
        price,
        discount,
        stock,
        rating,
        reviews,
        description,
        features,
        warranty,
        dimensions: {
            width,
            height,
            depth
        },
        weight,
        color,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    await product.save();
    res
        .status(200)
        .json({
            success: true,
            message: "Product successfully created",
            product,
        });
});



// DELETE PRODUCT
export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;
    const parseId = parseInt(id);
    if (isNaN(parseId)) {
        return next(new ErrorHandler("Bad request", 400));
    }


    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 400));
    }
    await product.deleteOne()
    res
        .status(200)
        .json({ message: "Product deleted", success: true })

});


// Get Particular Product->
export const getParticularProduct = asyncErrorHandler(async (req, res, next) => {
    const user = req.user;
    const userId = user._id;
    const { id } = req.params;
    const parseId = parseInt(id);
    req.session.visited = true;
    if (isNaN(parseId)) {
        return next(new ErrorHandler("Bad request", 400));
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
        return next(new ErrorHandler("User not found", 400))
    }

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("User not found", 400))
    }
    res
        .status(200)
        .json({ message: "product achieved", success: true, product });
});


// Get Products->
export const getProducts = asyncErrorHandler(async (req, res, next) => {

    const { query: { filter, value } } = req;
    req.session.visited = true;
    const features = new ApiFeatures(Product.find(), req.query).filter().sort().limitFields().paginate();

    const products = await features.query;
    if (!products) {
        return next(new ErrorHandler("Users not found", 400))
    }

    if (!filter && !value) {
        res
            .status(200)
            .json({ message: "products achieved", success: true, products });
    }

    if (filter && value) {
        products.filter((products) => products[filter].includes(value));

        res
            .status(200)
            .json({ message: "products achieved", success: true, products });
    }
});



// Update Product Details->
export const updateProductDetails = asyncErrorHandler(async (req, res, next) => {

    const userId = req.user._id;
    req.session.visited = true;
    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Please Select Product", 400));
    }
    const parseId = parseInt(id);
    if (isNaN(parseId)) {
        return next(new ErrorHandler("Bad request", 400));
    }

    const {
        name, category, brand, price, discount, stock, rating, reviews, description, features, warranty, width, height, depth, weight, color
    } = req.body;

    const findUser = User.findById(userId);
    if (!findUser) {
        return next(new ErrorHandler("Cannot find User", 400));
    }
    const product = await Product.findByIdAndUpdate(
        {
            name, category, brand, price, discount, stock, rating, reviews, description, features, warranty, width, height, depth, weight, color

        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res
        .status(200)
        .json({ message: "User Details Updated", success: true, product });
});


export const getParticularProductWithLimitations = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const parseId = parseInt(id);

    if (isNaN(parseId)) {
        return next(new ErrorHandler("Bad request", 400));
    }

    const product = await Product.find();



    // BASIC-> EQ, NEQ, LT, LTE, GT, GTE
    // const product = await Product.find({price:{$lte:100}});

    // const product = await Product.find({price:{$eq:100}})


    // BASIC-> IN,NIN
    // Value of Price must be 50, 80, 100
    // const product = await Product.find({price:{$in:[50,80,100]}});

    // Value of price must not be equal to 50, 80, 100
    // const product = await Product.find({price:{$nin:[50,80,100]}});

    // OR
    // const product = await Product.find({ $or: [{ price: { $gte: 50 } }, { price: { $lte: 100 } }] })


    // AND
    // const product = await Product.find({ $and: [{ price: { $gte: 50 } }, { price: { $lte: 100 } }] })


    // REGEX
    // const product = await Product.find({name:{$regex:/^A/}});


    // EXPR-> It will return the document of collection where price1 is more than price2
    //  const product = await Product.find({$expr:{ $gt:['price1','price2'] }})

    // EXPR-> It will return the documents in the collection where the value of price field is greater than the average value of the price field for all the documents in the collection
    // const product = await Product.find({
    //     $expr:{
    //         $gt:['$price', {$avg: '$price'}]
    //     }
    // })


    // TEXT-> will return the matched expression
    // const product = await Product.find({$text:{$search:"text to be search"}});


    if (!product) {
        return next(new ErrorHandler("User not found", 400))
    }
    res
        .status(200)
        .json({ message: "product achieved", success: true, product });
});




// Transactions->
// export const transaction = asyncErrorHandler(async(req,res,next)=>{
//     var session = await Product.startSession();
//     session.startTransaction();

//     var cust = session.Product.find({price}).cust;
//     cust.updateOne({_id:1}, {$inc:{bal: -100}});
//     cust.updateOne({_id:2}, {$inc:{bal:100}});

//     session.commitTransaction();
//     // session.abortTransation();

//     session.endSession();
// })


