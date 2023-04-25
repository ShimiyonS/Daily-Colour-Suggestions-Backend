import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
    type:{type:String,required:true},
    name:{type:Array,required:true}
}); 

const Color = mongoose.model("color",colorSchema);

//Dat of colors we used : 
 
// Color.insertMany([{
//     type:"warm",
//     name:["lightcoral","crimson","lightpink","tomato","khaki",
//   "orchid","slateblue","palegreen","lightseagreen","skyblue","royalblue","lightslategray",
//   "bisque","sandybrown","goldenrod","peru","honeydew", "ivory","silver"]
//   },
//   {
//     type:"cool",
//     name:["darkred","hotpink","mediumvioletred","orangered","gold","khaki",
//   "fuchsia", "blueviolet", "indigo","limegreen","springgreen", "olivedrab",
//   "teal","cyan","darkturquoise","deepskyblue","blanchedalmond",
//   "sandybrown","snow","black"]
//   }], function(err){
//     if(err){
//         console.log(err)
//     }else{
//         console.log("Sucesfully created")
//     }
// });


 
export {Color}; 