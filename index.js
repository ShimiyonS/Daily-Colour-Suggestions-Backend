import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoConnect } from "./db.js";
import { signUpRouter } from "./routes/singnupUser.js";
import { loginRouter } from "./routes/loginUser.js";
import{passwordResetRouter} from "./routes/passwordReset.js";
import { colorUserrouter } from "./routes/colorUser.js";

dotenv.config();

//database connection
MongoConnect();

const PORT = process.env.PORT;
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/signup", signUpRouter);
app.use("/api/login", loginRouter); 
app.use("/api/password-reset", passwordResetRouter); 
app.use("/api/color-app",colorUserrouter); 

app.listen(PORT, () => console.log(`Listening to port ${PORT}`)); 
