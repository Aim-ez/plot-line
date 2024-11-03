// mongo
require('./config/db.jsx');

const app = require('express')();
const port = 3000;

const UserRouter = require('./api/User.jsx');

// For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})