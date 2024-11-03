const express = require('express');
const router = express.Router();

// mongoDB user model
const User = require('./../models/User.jsx');

// Password handler
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
    let {name, username, email, password} = req.body;
    name = name.trim();
    username = username.trim();
    email = email.trim();
    password = password.trim();

    //ensure sign up fields are valid
    if (name == "" || username == "" || email=="" || password=="") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    } else if (!/^(?!.*[ _-]{2})(?!.*[ _-]$)[A-Za-z0-9_-]{3,20}$/.test(this.username)) {
        //This ensures username is 3-20 chars, can contain
        //letters a-zA-Z, numbers, underscores, and hyphens.
        //Cannot start/end with an underscore or hyphen and no spaces.
        res.json({
            status: "FAILED",
            message: "Invalid username entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
    } else {  // Checking if user already exists
        User.find({email}).then(result => {
            //Checking email
            if (result.length) {
                // User with email exists
                res.json({
                    status: "FAILED",
                    message: "User with that email already exists."
                })
            } else {
                // Checking username
                User.find({username}).then(result => {
                    if (result.length) {
                        // User with username exists
                        res.json({
                            status: "FAILED",
                            message: "User with that username already exists."
                        })
                    } else {
                        // TRY TO CREATE NEW USER

                        // password handling
                        const saltRounds = 10;
                        bcrypt.hash(password, saltRounds).then(hashedPassword => {
                            const newUser = new User({
                                name,
                                username,
                                email,
                                password: hashedPassword,
                            });

                            newUser.save().then(result => {
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signup sucessful!",
                                    data: result, //sent back to frontend
                                })
                            }).catch(err => {
                                console.log(err);
                                res.json({
                                    status: "FAILED", 
                                    message: "An error occured while saving user account!"
                                })
                            })
                        }).catch(err => {
                            console.log(err);
                            res.json({
                                status: "FAILED",
                                message: "An error occured while hashing password!"
                            })
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "An error occured while checking for existing username!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing email!"
            })
        })
    }
})

//Login
router.post('/login', (req, res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    } else {
        // Check if user exists
        User.find({email}).then(data => {
            if (data.length) {
                // User exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        // password match
                        res.json({
                            status: "SUCCESS",
                            message: "Login successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Incorrect password",
                        })
                    }
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing passwords."
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid email",
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user."
            })
        })
    }
})

module.exports = router;