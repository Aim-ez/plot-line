// mongo
require('./config/db.jsx');
// Host URL
const HostURL = require('../plot-line/constants/URL.js')

const app = require('express')();
const port = 3000;

const cors = require('cors');
const corsOptions = {
    origin: [HostURL, 'https://i3o4d8s-aim-ez-8081.exp.direct'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}
app.use(cors(corsOptions));

const UserRouter = require('./api/User.jsx');

// For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}) 