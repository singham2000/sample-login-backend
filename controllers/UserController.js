const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const { name, dob, email, password } = req.body;

        //Checking if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400)
                .json({ message: "Email is already in use" });
        }
        //Create a new user
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name, dob, email, hashPassword
            });

            const token = await newUser.generateToken();
            await newUser.save();
            res.status(201)
                .json({
                    message: 'User created successfully',
                    status: true,
                    token: token
                });
        } catch (err) {
            res.status(500)
                .send({
                    message: err.message,
                    status: false
                })
        }


    } catch (err) {
        res.status(500)
            .send({
                message: err.message,
                status: false
            })
    }
}

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name: name });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.hashPassword);;
            const token = await user.generateToken();
            if (isMatch) {
                res.status(200)
                    .send({
                        message: "Login successful",
                        status: true,
                        token: token
                    })
            } else {
                res.status(401)
                    .send({
                        message: "Invalid Credentials",
                        status: false
                    })
            }

        } else {
            res.status(401)
                .send({
                    message: "Invalid Credentials",
                    status: false
                })
        }

    } catch (err) {
        res.status(500).send({ message: err.message })

    }
}