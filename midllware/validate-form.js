const bcrypt = require('bcrypt');
const validator = require('validator');

// Mongoose model
const User = require('../models/Users');

// Customer helpers
const { sendGrindMessageVerification } = require('../utils');

const validateFormRegister = async (req, res, next) => {
    try {

        const { name, surname, telphone, email, password, repeatPassword, linkVerification   } = req.body;

            if( name.length < 2 ) {
                return res.status(400).json({ message: 'Try again enter name' });
            }

            if( surname.length < 2 ) {
                return res.status(400).json({ message: 'Try again enter surname' });
            }

            if(telphone < 10) {
                return res.status(400).json({ message: 'Try again enter number telphone' });
            }

            if( !validator.isEmail(email) ) {
                return res.status(400).json({ message: 'Invalidate email, try again enter email' })
            }

            const candidate = await Promise.resolve( User.findOne({ email }) );

            if(candidate) {
                return res.status(400).json({ message: 'This user already exists' });
            }

            if(password !== repeatPassword) {
                return res.status(400).json({ message: 'Password mismatch, try enter again' });
            }

            if(password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' })
            }

            const verificationCode = Math.round( Math.random() * (999999 - 111111) + 111111 ); // create random verification code

            const sendGrindMessage = await Promise.resolve( sendGrindMessageVerification(email, linkVerification, verificationCode, res) );

            if(!sendGrindMessage) {
                return res.status(400).json({ 
                    message: 'Failed to send message with confirmation code. Please check your email or try again later' 
                });
            }

            req.body.verificationCode = verificationCode;
            req.body.linkVerification = linkVerification;

            next();

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const validateFormVerification = async (req, res, next) => {
    try {

        const { email, verificationCode } = req.body;

        if( verificationCode.length < 6 || verificationCode.length > 6 ) {
            return res.status(400).json({ message: 'The input field must be 6 digits long.' })
        }

        const user = await Promise.resolve( User.findOne({ email }) );

        if(!user) {
            return res.status(400).json({ message: 'You not registred' });
        }

        if(user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Not correct code verification' });
        }

        next();

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const validateFormLogin = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const user = await Promise.resolve( User.findOne({ email }) );

        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await Promise.resolve( bcrypt.compare(password, user.password) );

        if (isMatch) {
            return res.status(400).json({ message: 'Not correct password' });
        }

        next();

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    validateFormRegister,
    validateFormVerification,
    validateFormLogin,
}