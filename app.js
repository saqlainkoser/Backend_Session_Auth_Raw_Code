const express = require("express");
const session = require("express-session");
const TWO_HOURS = 1000 * 15

const {
    PORT = 3030, 
    SESS_NAME = 'sid',
    SESS_LIFETIME = TWO_HOURS,
    SESS_SECRET = "secret"
} = process.env

const bodyParser = require("body-parser")

const app = express();

app.use(bodyParser.urlencoded({extended:true}))

//database
const users = [
    {id:1 , name:"shaan" , email :"s@gmail.com" ,password : "secret" },
    {id:2 , name:"rahul" , email :"r@gmail.com" ,password : "secret" },
    {id:3 , name:"nivesh" , email :"n@gmail.com" ,password : "secret" },
]

//session configuration
app.use(session({
    name : SESS_NAME, //not mandatory
    resave : false,
    saveUninitialized : false,
    secret :SESS_SECRET,
    cookie : {
        maxAge : SESS_LIFETIME, //not mandatory
    }
}))

//middleware 
const redirectLogin = (req,res,next)=>{
    if(!req.session.userId){
        res.redirect("/login")
    }
    else{
        next()
    }
}

const redirectHome = (req,res,next)=>{
    if(req.session.userId){
        res.redirect("/home")
    }
    else{
        next()
    }
}

app.get("/",(req,res)=>{
    // const userId = 0
    const {userId} = req.session //ye batana hai
res.send(`
    <h1>Welcome!</h1>
    ${userId ? `
        <a href="/home">Home</a>
         <form method="post" action="/logout">
            <button>Logout</button>
         </form>
        ` : `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
        ` }
    `)
})

app.get("/home",redirectLogin,(req,res)=>{
res.send(`
    <h1>Home</h1>
    <a href="/">Main</a>
    <ul>
        <li>Name:</li>
        <li>Email:</li>
    </ul>
    `)
})

app.get("/login",redirectHome,(req,res)=>{
res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
            <input name="email" type="email" placeholder="Email" required/>
            <input name="password" type="password" placeholder="Password" required/>
            <button type="submit" >Login</button>
         </form>
         <a href="/register">Register</a>
    `)
})

app.get("/register",(req,res)=>{
    res.send(`
    <h1>Register</h1>
    <form method="POST" action="/register">
            <input name="name" type="name" placeholder="Name" required/>
            <input name="email" type="email" placeholder="Email" required/>
            <input name="password" type="password" placeholder="Password" required/>
            <button>Register</button>
         </form>
         <a href="/login">Login</a>
    `)
})

app.post("/login",(req,res)=>{
    const {email,password}  = req.body 
    if(email && password){
        const user = users.find( 
            user => user.email === email && user.password === password 
        )
        if(user){
            req.session.userId = user.id
            return res.redirect("/home")
        }
    }
    res.redirect("/login")
})

app.post("/register",(req,res)=>{
//name email password
//dabase mein append karan h
//session id create karke login 
const {name,email,password} = req.body
const newId = users.length + 1

if(name && email && password){
    const thisUser = users.find(user => user.email === email)
    if(!thisUser){     
    const user = {
        id : newId,
        name : name ,
        email : email,
        password : password
    }
    users.push(user)
    req.session.userId = newId
    return res.redirect('/home')
    }
}
res.redirect("/register")
})

app.post("/logout",(req,res)=>{
    req.session.destroy((err) =>{
        if(err){
            res.redirect("/home")
        }
        else{
            res.clearCookie(SESS_NAME)
            res.redirect("/login")
        }
    })
})


app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    
})