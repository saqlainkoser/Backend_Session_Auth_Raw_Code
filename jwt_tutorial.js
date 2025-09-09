const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express();

app.use(cookieParser())

app.get("/",(req,res)=>{
    const token = jwt.sign({name:"Shaan"},"supersecret")
    res.cookie("token",token)
    res.send("Hello JWT")
})

app.listen(3080,()=>{
    console.log(`http://localhost:3080`) 
})