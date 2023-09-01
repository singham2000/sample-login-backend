const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const userController = require('./controllers/UserController');
const bodyParser = require('body-parser');

const URI = `mongodb+srv://surya:singham.2000@blackcoffer.sbunmxg.mongodb.net?retryWrites=true&w=majority`;

const PORT = 5000;

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(URI);
        console.log("Connect Pass");
    } catch (err) {
        console.error("Connect Failed", err);
        process.exit(1);
    }
};
connectDB();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/addUser', userController.createUser);
app.post('/login', userController.login);


app.listen(PORT, () => {
    console.info(`Server is running at ${PORT}`)
})