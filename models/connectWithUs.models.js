import mongoose from 'mongoose'

const connectWithUsSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    message:{
        type:String,
        required:true,
    },
})

const connectWithUs = mongoose.model('ConnectWithUs',connectWithUsSchema)
export default connectWithUs