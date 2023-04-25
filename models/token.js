import mongoose from "mongoose";
const Schema = mongoose.Schema;
const tokenSchema  =  new Schema({
    userId:{
        type:Schema.ObjectId,
        required:true,
        ref:"user",
        unique:true,
    },
    token:{type:String,required:true},
    createdAT:{type:Date,default:Date.now}, //1 hour

});

const Token = mongoose.model("token", tokenSchema);
export {Token}; 