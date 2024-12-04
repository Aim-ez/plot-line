const express = require('express');
const router = express.Router();
const axios = require('axios');

const GOOGLE_BOOKS_API_KEY = 'AIzaSyA4Z1Qm7N2_6AnPLHOtS577y4-nV_NrAb8';
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';


// mongoDB models
const User = require('./../models/User.jsx');
const ReadingList = require('./../models/ReadingList.jsx');
const Review = require('./../models/Review.jsx');
const Book = require('./../models/Book.jsx');
const CurrentlyReading = require('./../models/CurrentlyReading.jsx');



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
    let {isbn, title, author, published, description, coverLink,} = req.body;
    isbn = isbn;
    title = title.trim();
    author = author.trim();
    published = published.trim();
    description = description.trim();
    coverLink = coverLink.trim();

    genre = genre ? genre.trim() : null;

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
            coverLink,
            genre
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
        coverLink,
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

// backend route to get book object from id
router.get('/getBook', async (req, res) => {
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
            data: book,
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

router.get('/getReadingList', async (req, res) => {
    let { userId } = req.query;
    userId = userId.trim();

    if (!userId) {
        return res.status(400).json({
            status: "FAILED",
            message: "User ID parameter is required"
        });
    }

    try {
        //Find readinglist by userId
        const data = await ReadingList.findOne({ userId: userId });

        if (!data) {
            return res.status(404).json({
                status: "FAILED",
                message: "Reading list not found"
            });
        }

        //Return the reading list
        return res.status(200).json({
            status: "SUCCESS",
            data: data
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while fetching user reading list"
        });
    }
});

router.post('/addToReadingList', async (req, res) => {
    let { userId, book } = req.body;
    userId = userId.trim()

    if (!userId || !book) {
        return res.status(400).json({
            status: "FAILED",
            message: "Reading list and book are required"
        })
    }

    try {
        const list = await ReadingList.findOne({ userId });

        const isAlreadyInList = list.books.some(
            (b) => b.isbn === book.isbn
        );


        if (!isAlreadyInList){
            list.books.push(book);
            await list.save();
            return res.status(200).json({
                status: "SUCCESS",
                message: "Book added to reading list successfully",
            });
        } else {
            return res.status(200).json({
                status: "FAILED",
                message: "This book is already in your reading list!",
            })
        }
    } catch (error) {
        console.error("Error adding book to raeding list: ", error);
        return res.status(500).json({ error: 'An error occured' })
    }
})

router.post('/removeFromReadingList', async (req, res) => {
    let { userId, book } = req.body;
    userId = userId.trim()

    if (!userId || !book) {
        return res.status(400).json({
            status: "FAILED",
            message: "Reading list and book are required."
        })
    }

    try {
        const list = await ReadingList.findOne({ userId });

        if (!list) {
            return res.status(404).json({
                status: "FAILED",
                message: "Reading list not found."
            });
        }

        const bookIndex = list.books.findIndex((b) => b.isbn === book.isbn);
        if (bookIndex === -1) {
            return res.status(404).json({ error: "Book not found in reading list"})
        }

        list.books.splice(bookIndex, 1);
        await list.save()

        return res.status(200).json({
            status: "SUCCESS",
            message: "Book removed from reading list successfully",
            list,
        })
    } catch (error) {
        console.error("Error removing book from reading list: ", error);
        return res.status(500).json({error: 'An error occurred'});
    }
})

router.post('/setFavourite', async (req, res) => {
    let {userId, bookId} = req.body;
    userId = userId.trim()
    bookId = bookId.trim()

    if (!userId || !bookId) {
        return res.status(400).json({
            status: "FAILED",
            message: "UserID and bookID are required."
        })
    }
    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found.",
            });
        }

        // Check if the book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                status: "FAILED",
                message: "Book not found.",
            });
        }

        // Update the user's favourite book
        user.favourite = bookId;
        await user.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Favourite book updated successfully.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while updating the favourite book.",
        });
    }
});

router.get('/getFavourite', async (req, res) => {
    let { userId } = req.query;
    if (userId === undefined) { //Deals with errors when logging out of profile
        return res.status(200).json({
            status: "SUCCESS",
            data: null,
          });
    }
    userId = userId.trim()
    
    if (!userId) {
      return res.status(400).json({
        status: "FAILED",
        message: "User ID is required.",
      });
    }
  
    try {
      const user = await User.findById(userId).populate('favourite');
      if (!user || !user.favourite) { //User doesnt' have a favourite
        return res.status(200).json({
          status: "SUCCESS",
          data: null,
        });
      }
  
      return res.status(200).json({
        status: "SUCCESS",
        data: user.favourite._id,
      });
    } catch (error) {
      console.error("Error fetching favorite book:", error);
      return res.status(500).json({
        status: "FAILED",
        message: "An error occurred while fetching the favorite book.",
      });
    }
  });

  router.post('/clearFavourite', async (req, res) => {
    let {userId} = req.body;
    userId = userId.trim()

    if (!userId) {
        return res.status(400).json({
            status: "FAILED",
            message: "UserID is required."
        })
    }
    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found.",
            });
        }

        // Update the user's favourite book
        user.favourite = null;
        await user.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Favourite book updated successfully.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while updating the favourite book.",
        });
    }
});

// Fetch 'About Me'
router.get('/getAboutMe', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ status: "FAILED", message: "UserID is required." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "FAILED", message: "User not found." });
        }

        return res.status(200).json({ status: "SUCCESS", data: user.about });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "FAILED", message: "Error fetching 'About Me'." });
    }
});

// Update 'About Me'
router.post('/updateAboutMe', async (req, res) => {
    const { userId, aboutMe } = req.body;

    if (!userId || aboutMe === undefined) {
        return res.status(400).json({ status: "FAILED", message: "UserID and AboutMe are required." });
    }

    if (aboutMe.length > 500) {
        return res.status(400).json({ status: "FAILED", message: "'About Me' exceeds 500 characters." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "FAILED", message: "User not found." });
        }

        user.about = aboutMe;
        await user.save();

        return res.status(200).json({ status: "SUCCESS", message: "'About Me' updated successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "FAILED", message: "Error updating 'About Me'." });
    }
});

// Route to toggle privacy status
router.post('/togglePrivacy', async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: "FAILED", message: "User not found" });
        }

        // Toggle privacy status
        user.private = !user.private;
        await user.save();

        return res.status(200).json({ status: "SUCCESS", data: user.private });
    } catch (error) {
        console.error("Error toggling privacy status:", error);
        return res.status(500).json({ status: "FAILED", message: "Error toggling privacy status" });
    }
});

// Route to get the privacy status of a user
router.get('/getPrivacyStatus', async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: "FAILED", message: "User not found" });
        }

        return res.status(200).json({ status: "SUCCESS", data: user.private });
    } catch (error) {
        console.error("Error fetching privacy status:", error);
        return res.status(500).json({ status: "FAILED", message: "Error fetching privacy status" });
    }
});

// Add or update book status in the currently reading list
router.post('/addCurrentlyReading', async (req, res) => {
    const { userId, bookId, status } = req.body;

    if (!userId || !bookId || !status) {
        return res.status(400).json({ status: 'FAILED', message: 'Missing required fields.' });
    }

    try {
        let currentlyReading = await CurrentlyReading.findOne({ userId });

        if (!currentlyReading) {
            // If no currently reading document exists for the user, create one
            currentlyReading = new CurrentlyReading({ userId, books: [] });
        }

        // Check if the book is already in the list
        const existingBook = currentlyReading.books.find(
            (entry) => entry.book.toString() === bookId
        );

        if (existingBook) {
            // Update the status if the book already exists
            existingBook.status = status;
        } else {
            // Add the book to the list
            currentlyReading.books.push({ book: bookId, status });
        }

        await currentlyReading.save();
        res.status(200).json({ status: 'SUCCESS', message: 'Book updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'FAILED', message: 'Server error.' });
    }
});

// Remove a book from the currently reading list
router.post('/removeCurrentlyReading', async (req, res) => {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ status: 'FAILED', message: 'Missing required fields.' });
    }

    try {
        const currentlyReading = await CurrentlyReading.findOne({ userId });

        if (!currentlyReading) {
            return res.status(404).json({ status: 'FAILED', message: 'No reading list found.' });
        }

        // Filter out the book
        currentlyReading.books = currentlyReading.books.filter(
            (entry) => entry.book.toString() !== bookId
        );

        await currentlyReading.save();
        res.status(200).json({ status: 'SUCCESS', message: 'Book removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'FAILED', message: 'Server error.' });
    }
});



// router.get('/recommendations', async (req, res) => {
//     const { userId, selectedLanguage, sortOrder, resultsPerPage = 10 } = req.query;

//     console.log("Received request for recommendations:", { userId, selectedLanguage, sortOrder, resultsPerPage });

//     if (!userId) {
//         return res.status(400).json({
//             status: "FAILED",
//             message: "User ID is required.",
//         });
//     }

//     const GOOGLE_BOOKS_API_BASE_URL = process.env.GOOGLE_BOOKS_API_BASE_URL;
//     const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

//     if (!GOOGLE_BOOKS_API_BASE_URL || !GOOGLE_BOOKS_API_KEY) {
//         console.error("Google Books API configuration is missing.");
//         return res.status(500).json({
//             status: "FAILED",
//             message: "Internal server error. API configuration is missing.",
//         });
//     }

//     try {
//         const user = await User.findById(userId).populate('favourite');
//         if (!user) {
//             return res.status(400).json({
//                 status: "FAILED",
//                 message: "User not found.",
//             });
//         }

//         const readingList = await ReadingList.findOne({ userId }).populate('books');
//         const authors = new Set();
//         const titles = new Set();
//         const genres = new Set(); // Set to store genres

//         // Extract user preferences: title, author, genre
//         if (user?.favourite) {
//             if (user.favourite.title) titles.add(user.favourite.title);
//             if (user.favourite.author) authors.add(user.favourite.author);
//             if (user.favourite.genre) genres.add(user.favourite.genre); // Add favorite genre
//         }

//         if (readingList?.books) {
//             readingList.books.forEach((book) => {
//                 if (book.author) authors.add(book.author);
//                 if (book.title) titles.add(book.title);
//                 if (book.genre) genres.add(book.genre); // Add genre from the reading list
//             });
//         }

//         // If no preferences found, return an error
//         if (authors.size === 0 && titles.size === 0 && genres.size === 0) {
//             return res.status(400).json({
//                 status: "FAILED",
//                 message: "No preferences found for the user.",
//             });
//         }

//         // Function to find the most frequent item in an array
//         const findMostFrequent = (arr) => {
//             const frequencyMap = arr.reduce((acc, item) => {
//                 acc[item] = (acc[item] || 0) + 1;
//                 return acc;
//             }, {});            
//             // Find the most frequent item
//             return Object.keys(frequencyMap).reduce((a, b) => frequencyMap[a] > frequencyMap[b] ? a : b);
//         };

//         // Get the most frequent author
//         const mostFrequentAuthor = authors.size > 0 ? findMostFrequent(Array.from(authors)) : null;
//         const mostFrequentGenre = genres.size > 0 ? findMostFrequent(Array.from(genres)) : null; // Get most frequent genre

//         console.log("Most frequent author:", mostFrequentAuthor);
//         console.log("Most frequent genre:", mostFrequentGenre);

//         // If no author is found, use an empty string for the query
//         let authorQuery = '';
//         if (mostFrequentAuthor) {
//             // If the author has multiple names, take only the first one
//             const authorsArray = mostFrequentAuthor.split(',');  // Split by commas (if any)
//             const firstAuthor = authorsArray[0].trim();  // Take the first author and trim any extra spaces
//             authorQuery = `inauthor:${firstAuthor}`;  // Only query with the first author's name
//         }

//         // If no genre is found, use an empty string for the query
//         let genreQuery = '';
//         if (mostFrequentGenre) {
//             genreQuery = `subject:${mostFrequentGenre}`; // Use the most frequent genre for Google Books API query
//         }

//         console.log("Author query:", authorQuery);
//         console.log("Genre query:", genreQuery);

//         // Function to fetch books based on query
//         const fetchBooks = async (query, languageQuery) => {
//             const encodedQuery = encodeURIComponent(query);
//             const url = `${GOOGLE_BOOKS_API_BASE_URL}?q=${encodedQuery}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=5${languageQuery}`;
//             console.log("Fetching books with URL:", url);
//             const response = await axios.get(url);
//             return response.data.items || [];
//         };

//         // Decide randomly between author or genre recommendation
//         const useAuthorRecommendation = Math.random() > 0.5; // Randomly decide whether to use author or genre
//         console.log("Recommendation method:", useAuthorRecommendation ? "Author" : "Genre");

//         let recommendedBooks = [];

//         if (useAuthorRecommendation && authorQuery) {
//             // Fetch books based on author
//             recommendedBooks = await fetchBooks(authorQuery, selectedLanguage ? `&langRestrict=${selectedLanguage}` : '');
//         } else if (!useAuthorRecommendation && genreQuery) {
//             // Fetch books based on genre
//             recommendedBooks = await fetchBooks(genreQuery, selectedLanguage ? `&langRestrict=${selectedLanguage}` : '');
//         }

//         // Map response data to desired format
//         const recommendations = recommendedBooks.map((item) => {
//             const { volumeInfo } = item || {};
//             const authors = volumeInfo?.authors ? [volumeInfo.authors[0]] : ["Unknown Author"];
//             const genre = volumeInfo?.categories ? volumeInfo.categories[0] : "Unknown Genre"; // Use categories (genres) from API

//             return {
//                 id: item.id,
//                 title: volumeInfo?.title || "Untitled",
//                 authors: authors,
//                 genre: genre,  // Add genre info to recommendations
//                 description: volumeInfo?.description || "No description available.",
//                 coverLink: volumeInfo?.imageLinks?.thumbnail || "default_cover_url",
//             };
//         });

//         console.log("Recommendations generated:", recommendations.length);

//         return res.status(200).json({
//             status: "SUCCESS",
//             data: recommendations,
//         });
//     } catch (error) {
//         if (error.response) {
//             console.error("Google Books API error:", error.response.data);
//             return res.status(500).json({
//                 status: "FAILED",
//                 message: "Error with Google Books API: " + error.response.data.error.message,
//             });
//         } else if (error.request) {
//             console.error("No response from Google Books API.");
//             return res.status(500).json({
//                 status: "FAILED",
//                 message: "No response from Google Books API.",
//             });
//         } else {
//             console.error("Unexpected error:", error.message);
//             return res.status(500).json({
//                 status: "FAILED",
//                 message: "An unexpected error occurred.",
//             });
//         }
//     }
// });

router.get('/recommendations', async (req, res) => {
    const { userId, selectedLanguage, sortOrder, resultsPerPage = 30 } = req.query;  // Fetch 30 books by default

    console.log("Received request for recommendations:", { userId, selectedLanguage, sortOrder, resultsPerPage });

    if (!userId) {
        return res.status(400).json({
            status: "FAILED",
            message: "User ID is required.",
        });
    }

    const GOOGLE_BOOKS_API_BASE_URL = process.env.GOOGLE_BOOKS_API_BASE_URL;
    const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

    if (!GOOGLE_BOOKS_API_BASE_URL || !GOOGLE_BOOKS_API_KEY) {
        console.error("Google Books API configuration is missing.");
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error. API configuration is missing.",
        });
    }

    try {
        const user = await User.findById(userId).populate('favourite');
        if (!user) {
            return res.status(400).json({
                status: "FAILED",
                message: "User not found.",
            });
        }

        const readingList = await ReadingList.findOne({ userId }).populate('books');
        const authors = new Set();
        const titles = new Set();
        const genres = new Set(); // Set to store genres

        // Extract user preferences: title, author, genre
        if (user?.favourite) {
            if (user.favourite.title) titles.add(user.favourite.title);
            if (user.favourite.author) authors.add(user.favourite.author);
            if (user.favourite.genre) genres.add(user.favourite.genre); // Add favorite genre
        }

        if (readingList?.books) {
            readingList.books.forEach((book) => {
                if (book.author) authors.add(book.author);
                if (book.title) titles.add(book.title);
                if (book.genre) genres.add(book.genre); // Add genre from the reading list
            });
        }

        // If no preferences found, return an error
        if (authors.size === 0 && titles.size === 0 && genres.size === 0) {
            return res.status(400).json({
                status: "FAILED",
                message: "No preferences found for the user.",
            });
        }

        // Function to find the most frequent item in an array
        const findMostFrequent = (arr) => {
            const frequencyMap = arr.reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1;
                return acc;
            }, {});            
            return Object.keys(frequencyMap).reduce((a, b) => frequencyMap[a] > frequencyMap[b] ? a : b);
        };

        // Get the most frequent author and genre
        const mostFrequentAuthor = authors.size > 0 ? findMostFrequent(Array.from(authors)) : null;
        const mostFrequentGenre = genres.size > 0 ? findMostFrequent(Array.from(genres)) : null;

        console.log("Most frequent author:", mostFrequentAuthor);
        console.log("Most frequent genre:", mostFrequentGenre);

        let authorQuery = '';
        if (mostFrequentAuthor) {
            const authorsArray = mostFrequentAuthor.split(',');
            const firstAuthor = authorsArray[0].trim();
            authorQuery = `inauthor:${firstAuthor}`;
        }

        let genreQuery = '';
        if (mostFrequentGenre) {
            genreQuery = `subject:${mostFrequentGenre}`;
        }

        console.log("Author query:", authorQuery);
        console.log("Genre query:", genreQuery);

        const fetchBooks = async (query, languageQuery) => {
            const encodedQuery = encodeURIComponent(query);
            const url = `${GOOGLE_BOOKS_API_BASE_URL}?q=${encodedQuery}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=30${languageQuery}`;
            console.log("Fetching books with URL:", url);
            const response = await axios.get(url);
            return response.data.items || [];
        };

        const useAuthorRecommendation = Math.random() > 0.5;

        let recommendedBooks = [];

        if (useAuthorRecommendation && authorQuery) {
            recommendedBooks = await fetchBooks(authorQuery, selectedLanguage ? `&langRestrict=${selectedLanguage}` : '');
        } else if (!useAuthorRecommendation && genreQuery) {
            recommendedBooks = await fetchBooks(genreQuery, selectedLanguage ? `&langRestrict=${selectedLanguage}` : '');
        }

        // Map the fetched books to the desired format
        const recommendations = recommendedBooks.map((item) => {
            const { volumeInfo } = item || {};
            const authors = volumeInfo?.authors ? [volumeInfo.authors[0]] : ["Unknown Author"];
            const genre = volumeInfo?.categories ? volumeInfo.categories[0] : "Unknown Genre";

            return {
                id: item.id,
                title: volumeInfo?.title || "Untitled",
                authors: authors,
                genre: genre,
                description: volumeInfo?.description || "No description available.",
                coverLink: volumeInfo?.imageLinks?.thumbnail || "default_cover_url",
            };
        });

        // Randomly choose 3 books from the fetched recommendations
        const randomRecommendations = [];
        const randomIndexes = new Set();
        while (randomRecommendations.length < 3 && randomRecommendations.length < recommendations.length) {
            const randomIndex = Math.floor(Math.random() * recommendations.length);
            if (!randomIndexes.has(randomIndex)) {
                randomRecommendations.push(recommendations[randomIndex]);
                randomIndexes.add(randomIndex);
            }
        }

        console.log("Recommendations generated:", randomRecommendations.length);

        return res.status(200).json({
            status: "SUCCESS",
            data: randomRecommendations,
        });
    } catch (error) {
        console.error("Error fetching recommendations:", error.message);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while fetching recommendations.",
        });
    }
});


module.exports = router;
