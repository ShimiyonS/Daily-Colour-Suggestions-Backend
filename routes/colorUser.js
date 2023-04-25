import express from "express";
import { Color } from "../models/colors.js";
const router = express.Router();
import jwt from "jsonwebtoken";

router.post("/add", async(req, res)=>{
  try {
    const Create = await new Color.insertMany([{
      type:"warm",
      name:["lightcoral","crimson","lightpink","tomato","khaki",
    "orchid","slateblue","palegreen","lightseagreen","skyblue","royalblue","lightslategray",
    "bisque","sandybrown","goldenrod","peru","honeydew", "ivory","silver"]
    },
    {
      type:"cool",
      name:["darkred","hotpink","mediumvioletred","orangered","gold","khaki",
    "fuchsia", "blueviolet", "indigo","limegreen","springgreen", "olivedrab",
    "teal","cyan","darkturquoise","deepskyblue","blanchedalmond",
    "sandybrown","snow","black"]
    }]).save();
    if(!Create){
      return res.status(400).json({Message:"Error Posting data"});
    }else{
      res.status(200).json(Create)
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({message : "Internal Server Error"})
  }
})
router.get("/", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    jwt.verify(token, process.env.SECRET_KEY);

    const color = await Color.findOne({ type: req.query.type });
    if (!color) return res.status(400).send({ message: "Select a Skin Type" });

    res.status(200).send({ data: color.name });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export const colorUserrouter = router;
