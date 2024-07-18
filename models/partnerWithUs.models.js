import mongoose from "mongoose";

const partnerUsSchema = mongoose.Schema({
    nameOfCompany:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    whyYouWantToCollab:{
        type:String,
    }

});

const partnerUs = mongoose.model('PartnerUs',partnerUsSchema);
export default partnerUs;