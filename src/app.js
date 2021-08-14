require('dotenv').config()
const express = require("express")
const app = express()
const path = require("path")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")
const hbs = require("hbs")

require("./db/conn")
const Register = require("./models/register")

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

//static paths
const staticPath = path.join(__dirname, "../public")
const templatePath = path.join(__dirname, "../templates/views")
const partialPath = path.join(__dirname, "../templates/partials")

app.use(express.static(staticPath))
app.set("view engine", "hbs")
app.set("views", templatePath)
hbs.registerPartials(partialPath)

//Home page
app.get("/", (req, res) => {
    res.render("index")
})

//secret page
app.get("/tutorials", auth, (req, res) => {
    res.render("tutorials")
})

//logout page
app.get("/logout", auth, async (req, res) => {
    try {

        // /* for single logout */
        // req.user.tokens = req.user.tokens.filter((currElem) =>{
        //     return currElem.token !== req.token
        // })

        // /* logout from all devices */
        req.user.tokens = []

        res.clearCookie("jwt")
        console.log("Logout successfully")
        
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})

//login page
app.get("/login", (req, res) => {
    res.render("login")
})

//register page
app.get("/register", (req, res) => {
    res.render("register")
})

//Create new user in database
app.post("/register", async (req, res) => {
    try {

        const password = req.body.password
        const cpassword = req.body.confirmpassword

        //if password and confirm password is match then your account has been created
        if (password === cpassword) {

            const registerData = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            //token generation
            const token = await registerData.generateAuthToken()

            //to get cookis
            res.cookie("jwt", token,{
                expires: new Date(Date.now() + 50000000),
                httpOnly: true
            })

            //save the filled data in database
            const registered = await registerData.save()

            //after saved data home wil be visible you
            res.status(201).render("index")

        } else {
            res.send("Invalid Login Details")
        }

    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
})

// login using your email and password
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        //find email entered by user in database to login
        const userEmail = await Register.findOne({email : email})

        //bcrypted password
        const isMatch = await bcrypt.compare(password, userEmail.password)

        // token generation for matching password
        const token = await userEmail.generateAuthToken()

        //to get cookies at login time
        res.cookie("jwt", token,{
            expires: new Date(Date.now() + 50000000),
            httpOnly: true,
            // secure:true
        })


        if(isMatch){
            res.status(201).render("index")
        }else{
            res.status(404).send("Invalid Login Details")
        }

    } catch (error) {
        res.status(400).send("Invalid Login Details")
        console.log(error)
    }
})

// server is listen at port no ${port}
app.listen(port, () => {
    console.log(`server is running on port no ${port}`)
})