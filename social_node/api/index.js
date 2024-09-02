const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
// const loginRoute = require("./routes/auth");
const cors = require("cors"); // Import CORS
const postRoute = require("./routes/post")
dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },(err) => {
        if(err) console.log(err) 
        else console.log("mongdb is connected");
})
// mongoose.connect("mongodb+srv://priyankar:priyankarnigam01@cluster0.sgw7jqv.mongodb.net/social_node")
//midleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors()); // Enable CORS for all routes

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts", postRoute);

app.listen(8800,()=>{
    console.log("Backend server is running!");
});