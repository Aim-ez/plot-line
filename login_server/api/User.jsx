const express = require('express');
const router = express.Router();

// mongoDB models
const User = require('./../models/User.jsx');
const ReadingList = require('./../models/ReadingList.jsx');
const Review = require('./../models/Review.jsx');
const Book = require('./../models/Book.jsx');


// Password handler
const bcrypt = require('bcrypt');

// Posts a review to the DB (NOTE: DOES NOT HAVE DATA CHECKS)
router.post('/createReview', (req, res) => {
    let {userId, bookId, rating, description, date} = req.body;
    description = description.trim();
    date = date.trim();

    if (userId == "" || bookId == "" || rating=="" || date=="") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else {
        const newReview = new Review({
            userId,
            bookId,
            rating,
            description,
            date,
        });

        newReview.save().then(result => {
            console.log("REVIEW ADD SUCCESSFUL")
            res.json({
                status: "SUCCESS",
                message: "Review add sucessful!",
                data: result, //sent back to frontend
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED", 
                message: "An error occured while creating review!"
            })
        })
    }
})

// Posts a book to the DB (NOTE: DOES NOT HAVE DATA CHECKS)
router.post('/createBook', (req, res) => {
    let {isbn, title, author, published, description, coverLink} = req.body;
    isbn = isbn;
    title = title.trim();
    author = author.trim();
    published = published.trim();
    description = description.trim();
    coverLink = coverLink.trim();

    //Due to google books not having all info, just check that we have 
    //at least one metric to find the book by
    if (isbn == "" && title == "" && author=="") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else {
        const newBook = new Book({
            isbn,
            title,
            author,
            published,
            description,
            coverLink
        });

        newBook.save().then(result => {
            console.log("BOOK ADD SUCCESSFUL")
            res.json({
                status: "SUCCESS",
                message: "Book add sucessful!",
                data: result, //sent back to frontend
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED", 
                message: "An error occured while creating book!"
            })
        })
    }
})

// Posts a book to the DB
router.post('/createManualBook', (req, res) => {
    let { isbn, title, author, published, description, coverLink } = req.body;

    // Check if fields exist and assign empty string if undefined or null
    isbn = isbn ? isbn.trim() : "";
    title = title ? title.trim() : "";
    author = author ? author.trim() : "";
    published = published ? published.trim() : "";
    description = description ? description.trim() : "";
    coverLink = coverLink ? coverLink.trim() : "";

    // Ensure that at least one identifier is present
    if (isbn === "" && title === "" && author === "") {
        return res.status(400).json({
            status: "FAILED",
            message: "At least one of ISBN, Title, or Author is required!"
        });
    }

    // Create new book object
    const newBook = new Book({
        isbn,
        title,
        author,
        published,
        description,
        coverLink
    });

    // Save the book to the database
    newBook.save()
        .then(result => {
            console.log("BOOK ADD SUCCESSFUL");
            return res.status(201).json({
                status: "SUCCESS",
                message: "Book added successfully!",
                data: result // Send the book data back to the frontend
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                status: "FAILED",
                message: "An error occurred while creating the book!"
            });
        });
});




// Signup
router.post('/signup', (req, res) => {
    let {name, username, email, password} = req.body;
    name = name.trim();
    username = username.trim();
    email = email.trim();
    password = password.trim();

    //Make it so that all usernames and emails are stored as lowercase
    //Therefore, ppl can't make an account @johndoe and @johnDoe
    //Also can't make johndoe@gmail.com and JohnDoe@gmail.com, etc.
    username = username.toLowerCase();
    email = email.toLowerCase();

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

                            const newReadingList = new ReadingList({
                                userId: newUser._id,
                                books: [],
                            });


                            newReadingList.save().then(() =>{
                                console.log("READING LIST CREATED")
                            }).catch(err => {
                                console.log(err);
                                res.json({
                                    status: "FAILED", 
                                    message: "An error occured while saving readinglist!"
                                })
                            });

                            newUser.save().then(result => {
                                console.log("SIGNUP SUCCESSFUL")
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
                    console.log(err)
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing passwords."
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "No user with that email exists",
                })
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user."
            })
        })
    }
})


router.get('/getReviews', async(req, res) => {
    let userId = req.query.userId;
    
    try {
        const data=await Review.find({userId})
        res.json({
            status: "SUCCESS", 
            data: data
        });
    } catch (error) {
        console.log(error)
        res.json({
            status: "FAILED",
            message: "An error occured while fetching review data.",
        })
    }
});

router.get('/getBookReviews', async(req,res) => {
    let bookId = req.query.bookId;
    
    try {
        const data=await Review.find({bookId})
        res.json({
            status: "SUCCESS", 
            data: data
        });
    } catch (error) {
        console.log(error)
        res.json({
            status: "FAILED",
            message: "An error occured while fetching review data.",
        })
    }
})

// RETURN 'FOUND' IF BOOK ALREADY REVIEWED BY CURR USER
// RETURN 'NOT FOUND' IF BOOK NOT REVIEWED YET BY CURR USER
router.get('/reviewExists', async (req, res) => {
    const { userId, bookId } = req.query;

    //All of these should match a book if it exists in our DB
    //INCLUDING IF ANY OF THEM ARE NULL
    try {
        const review = await Review.findOne({
            userId: userId,
            bookId: bookId,
        });

        if (!review) {
            //review not found
            return res.status(201).json({
               status: "NOT FOUND",
            });
        }

        //review found
        res.json({
            status: "FOUND",
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: "FAILED",
            message: "An error occurred while fetching book data."
        });
    }

});


// RETURN bookId IF BOOK WITH GIVEN DETAILS EXISTS
// RETURN null IF BOOK WITH GIVEN DETAILS DOES NOT EXIST
router.get('/bookExists', async (req, res) => {
    const { title, isbn, author } = req.query;

    console.log(title);
    console.log(isbn);
    console.log(author);
    
    //All of these should match a book if it exists in our DB
    //INCLUDING IF ANY OF THEM ARE NULL
    try {
        const book = await Book.findOne({
            title: title,
            author: author,
            isbn: isbn
        });

        if (!book) {
            //book not found
            return res.status(201).json({
               status: "NOT FOUND",
            });
        }

        //book found
        res.json({
            status: "FOUND",
            data: {bookId: book._id}
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: "FAILED",
            message: "An error occurred while fetching book data."
        });
    }

});

// backend route to get book details by bookId
router.get('/getBookData', async (req, res) => {
    const { bookId } = req.query;

    if (!bookId) {
        return res.status(400).json({
            status: "FAILED",
            message: "Book ID is required."
        });
    }

    try {
        // Fetch the book by ID
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                status: "FAILED",
                message: "Book not found."
            });
        }

        // Return book data
        res.json({
            status: "SUCCESS",
            data: {
                _id: bookId,
                isbn: book.isbn,
                title: book.title,
                author: book.author,
                published: book.published,
                description: book.description,
                coverLink: book.coverLink
            }
        });

    } catch (error) {
        console.error(error);
        res.json({
            status: "FAILED",
            message: "An error occurred while fetching book data."
        });
    }
});

// Route to get user ID by username
router.get('/getUserIdByUsername', async (req, res) => {
    let { username } = req.query; // Get username from query parameters
    username = username.trim()

    if (!username) {
        return res.status(400).json({
            status: "FAILED",
            message: "Username parameter is required"
        });
    }

    try {
        // Find the user by username (case-insensitive)
        const data = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

        if (!data) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found"
            });
        }

        // Return the user ID
        return res.status(200).json({
            status: "SUCCESS",
            data: {_id: data._id} // Returning the _id of the user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while fetching user data"
        });
    }
});

module.exports = router;