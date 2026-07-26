const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pino = require('pino');

const connectToDatabase = require('../models/db');

const logger = pino();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {

        // Task 1
        const db = await connectToDatabase();

        // Task 2
        const users = db.collection("users");

        // Task 3
        const existingUser = await users.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const email = req.body.email;

        // Task 4
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: hash
        };

        const result = await users.insertOne(user);

        // Task 5
        const payload = {
            user: {
                id: result.insertedId
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info("User registered successfully");

        res.json({
            authtoken,
            email
        });

    } catch (e) {

        logger.error(e);

        return res.status(500).send("Internal server error");

    }
});

router.post('/login', async (req, res) => {
    try {

        // Task 1
        const db = await connectToDatabase();

        // Task 2
        const users = db.collection("users");

        // Task 3
        const user = await users.findOne({
            email: req.body.email
        });

        // Task 7
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        // Task 4
        const passwordCompare = await bcryptjs.compare(
            req.body.password,
            user.password
        );

        if (!passwordCompare) {
            return res.status(400).json({
                error: "Invalid credentials"
            });
        }

        // Task 5
        const userName = user.firstName;
        const userEmail = user.email;

        // Task 6
        const payload = {
            user: {
                id: user._id
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({
            authtoken,
            userName,
            userEmail
        });

    } catch (e) {

        logger.error(e);

        return res.status(500).send("Internal server error");

    }
});
module.exports = router;