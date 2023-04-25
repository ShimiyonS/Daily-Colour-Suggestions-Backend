import express from "express";
import bcrypt from "bcrypt";
import joi from "joi";
import { User } from "../models/user.js";
import { Token } from "../models/token.js";
import { sendEmail } from "../chekmail/sendEmail.js";
import crypto from "crypto";
import passwordComplexity from "joi-password-complexity";

const router = express.Router();

//sending password link:

router.post("/", async (req, res) => {
  try {
    const emailSchema = joi.object({
      email: joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(409)
        .send({ message: "user with given email does not exixt" });
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const url = `${process.env.BASE_URL}api/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password Reset", url);
    res
      .status(200)
      .send({ message: "Password Reset link sent to your email account" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//verify the password link

router.get("/:id/:token", async (req, res) => {
  try {
    const user = User.findOne({ _id: req.params._id });
    if (!user) return res.status(400).send({ message: "Invalid Link" });
    const token = Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Inavalid Link" });
    res.status(200).send({ message: "Valid url verified" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//setting new password :

router.post("/:id/:token", async (req, res) => {
  try {
    //assinging Password Schema
    const passwordSchema = joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //Cheaking for the user and token
    const user = await User.findOne({ _id: req.params.id });

    console.log(user);
    // console.log(req.params);
    if (!user) return res.status(400).send({ message: "Invalid User" });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    // const demo = await Token.find();
    // console.log(demo);
    //console.log(token);
    if (!token) return res.status(400).send({ message: "Invalid token" });

    //making user as verified
    if (!user.verified) user.verified = true;

    //generating hashed Pasword:
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashpassword;
    await user.save();
    await token.remove();
    res.status(200).send({ message: "Password reset Sucessful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export const passwordResetRouter = router;
