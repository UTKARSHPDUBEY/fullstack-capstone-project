const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pino = require('pino');
const { body, validationResult } = require('express-validator');
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
router.put(
    '/update',
    [
        body('firstName').notEmpty(),
        body('lastName').notEmpty()
    ],
    async (req, res) => {

    // Task 2
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {

        // Task 3
        const email = req.header("email");

        if (!email) {
            return res.status(400).json({
                error: "Email header missing"
            });
        }

        // Task 4
        const db = await connectToDatabase();
        const users = db.collection("users");

        // Task 5
        const existingUser = await users.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        existingUser.firstName = req.body.firstName;
        existingUser.lastName = req.body.lastName;

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            existingUser.password = await bcryptjs.hash(req.body.password, salt);
        }

        existingUser.updatedAt = new Date();

        // Task 6
        await users.updateOne(
            { email },
            { $set: existingUser }
        );

        // Task 7
        const payload = {
            user: {
                id: existingUser._id
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken });

    } catch (e) {

        logger.error(e);

        return res.status(500).send("Internal server error");

    }

});
module.exports = router;