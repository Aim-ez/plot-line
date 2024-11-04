// mongo
require('./config/db.jsx');

const app = require('express')();
const port = 3000;

const cors = require('cors');
const corsOptions = {
    origin: ['https://n8n9jlo-aim-ez-8081.exp.direct', 'http://172.30.128.25:3000'],
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