import mongoose from 'mongoose';
import validator from 'validator';
import fs from 'fs'


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        validate: [validator.isAlpha, "Enter characters only"],
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        validate: [validator.isAlpha, "Enter a valid Price"],
    },
    price: {
        type: Number,
        required: true,
        validate: [validator.isCurrency, "Enter a valid Price"],
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    discount: {
        type: Number,
        required: true,
        validate: [validator.isCurrency, "Enter a valid Number"],
    },
    stock: {
        type: Number,
        required: true,
        validate: [validator.isInt, "Enter a valid Number"],
    },
    rating: {
        type: Number,
        validate: {
            // here this will work for only create data
            validator: function (value) {
                return value >= 1 && value <= 5;
            },
            message: " Ratings must be from 1 to 5"
        }
    },
    reviews: {
        type: Number,
    },
    description: {
        type: String,
        trim: true,
    },
    features: {
        type: Array,
        default: [],
    },
    warranty: {
        typre: String,
        trim: true,
        validate: [validator.isAlphanumeric, "enter valid entity"]
    },
    dimensions: {
        width: {
            type: String,
            validate: [validator.isAlphanumeric, "enter valid entity"]
        },
        height: {
            type: String,
            validate: [validator.isAlphanumeric, "enter valid entity"]
        },
        depth: {
            type: String,
            validate: [validator.isAlphanumeric, "enter valid entity"]
        },
    },
    weight: {
        type: String,
        trim: true,
    },
    color: {
        type: String,
    },
    createdAt: {
        type: String,
    },
    // duration:{
    //     type:String,
    // },
    createdBy: {
        type: String,
    },
    releaseDate: {
        type: Date,
    },
    bal:{
        type:String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// productSchema.virtual('durationInHours').get(function(){
//     return this.duration/60;
// })

// productSchema.pre('save',function(next){
//     this.createdBy = 'Manoj';
//     next();
// })


productSchema.post('save', function (doc, next) {
    const content = `A new product with name:${doc.name} has been created by ${doc.createdBy}\n`;
    fs.writeFileSync('../log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message);
    })
    next();
})

productSchema.virtual('weightInGrams').get(function () {
    return this.weight * 1000;
})

// productSchema.virtual('review').get(function(){
//     return this.reviews;
// })

productSchema.pre(/^find/, function (next) {
    this.find({ releaseDate: { $lte: Date.now() } });
    this.startTime = Date.now();
    next();
})


productSchema.post(/^find/, function (docs, next) {
    this.find({ releaseDate: { $lte: Date.now() } });
    this.endTime = Date.now();

    const content = `Query took ${this.endTime - this.startTime} milliseconds\n`;
    fs.writeFileSync('../log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message)
    })
    next();
})


// INDEXING->

// // It will apply BS on search result->
// const createIndexing = productSchema.createIndex({price:1});
// // Descending Order 
// const descendingOrder = productSchema.createIndex({age:-1});
// // Get Indexing
// const getIndexing = productSchema.getIndexes();
// // Drop Indexing
// const dropIndexing = productSchema.dropIndexes()

// // COMPOUND Indexing->
// const compoundIndexing = productSchema.createIndex({'price':1, 'brand':1});


// // for sorting purposes->
// const sortIndex = productSchema.createIndex({name:1}, {unique:true});

// // Partial Filter-> Indexing will apper only in price greater than 50
// const partialFilter = productSchema.createIndex({age:1},{partialFIlterExpression:{price:{$gt:50}}})

// // Deleting Indexing after a time Period
// const ttl = productSchema.createIndex({'expires': 1}, {expireAfterSeconds: 3600})




// BUCKET->
// const creatingBucket = productSchema.find({ $bucket: { groupBy: '$price', boundaries: '[50,80,100]', default: 'Greater tha 100 Group', output: { count: { $sum: 1 }, names: { $push: 'name'}}}});







const product = mongoose.model('Product', productSchema);
export default product;