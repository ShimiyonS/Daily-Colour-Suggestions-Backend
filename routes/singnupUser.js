import express from "express";
import { User, validate } from "../models/user.js";
import bcrypt from "bcrypt";
import { Token } from "../models/token.js";
import { sendEmail } from "../chekmail/sendEmail.js";
import crypto from "crypto";

const router = express.Router();

router.get("/", async (req, res) => {
  const user = await User.find({});
  res.send(user);
});

router.post("/", async (req, res) => {
  try {
    //validating the details of the user
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //finding wheather the user is already in the database
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exist" });

    //genrating hashedpassword for security
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //passing the new user to the database
    user = await new User({ ...req.body, password: hashpassword }).save();

    //email verification with token
    const token = await new Token({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
    }).save();
    // const url = `${process.env.BASE_URL}users/${token.userId}/verify/${token.token}`;
    // await sendEmail(user.email, "Verify Email", url);
    res
      .status(201)
      .send({ message: "Successfully Created" });
  } catch (error) {
    console.log(error);
    //showcasing the error if the server has some issues
    res
      .status(500)
      .send({ message: "Strong Password & Valid Email is required" });
  }
});

// //getting the link for verification :

// router.get("/users/:id/verify/:token", async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id });
//     if (!user) return res.status(400).send({ message: "Invaild Link" });

//     const token = await Token.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token) return res.status(400).send({ message: "Invalid Link" });
//     await User.updateOne({ email: user.email, verified: true });
//     //await token.remove();
//     res.status(200).send({ message: "Email verified Sucessfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });

router.delete("/", async (req, res) => {
  try {
    const user = await User.deleteOne({ email: req.body.email });
    if (user) return res.send({ message: "sucessfully deleted" });
  } catch (error) {
    res.status(400).send({ message: "internal server error" });
  }
});

//exporting the router

export const signUpRouter = router;
