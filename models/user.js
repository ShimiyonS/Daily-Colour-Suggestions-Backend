import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import joi from 'joi';
import passwordComplexity  from "joi-password-complexity";

const userSchema = new mongoose.Schema({
    
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
});
userSchema.methods.generateAuthToken = ()=>{
    const token = jwt.sign({_id:User._id},process.env.SECRET_KEY);
    return token
};

const User = mongoose.model("user",userSchema);

const validate = (data)=>{
    const schema = joi.object({
        username:joi.string().required().label("Username"),
        email:joi.string().email().required().label("Email"),
        password:passwordComplexity().required().label("Password"),
    });
    return schema.validate(data)
}
export {User,validate};

