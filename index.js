const express = require("express");
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose");
const router = require("./routes/todoRoutes.js");
require("dotenv").config();

const app = express();
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/", router);

mongoose.connect(process.env.DB_CONNECT, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, (err)=> {
    if (err) return 
    app.listen(process.env.PORT || 8000, ()=> {
        console.log("app is running ")
    })
    })


