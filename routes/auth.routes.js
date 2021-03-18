const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Mongoose model
const User = require('../models/Users');

// Customer middleware
const { 
    validateFormRegister,
    validateFormVerification,
    validateFormLogin,
} = require('../midllware');

const router = Router();   

// /api/auth/register
router.post('/register',
    validateFormRegister,
    async (req, res) => {
        try {

            const { name, surname, telphone, email, password, verificationCode, linkVerification } = req.body;
            
            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                name,
                surname,
                telphone,
                email,
                password: hashedPassword,
                verificationCode,
                isVerified: false,
                isAdmin: false,
            })

            await user.save();

            const dataUser = {
                email: user.email,
            }

            res.status(200).json({ user: dataUser, linkVerification, message: 'You success registered' })

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong, try again' })
        }
})

// /api/auth/verification
router.post('/verification', 
    validateFormVerification,
    async (req, res) => {
        try { 

            const { email } = req.body;

            const user = await Promise.resolve( User.findOne({ email }) );

            await Promise.resolve( User.updateOne(
                { _id: user._id },
                { isVerified: true } 
            ) )

            const token = jwt.sign(
                { _id: user._id }, 
                process.env.SECRET,  
                { expiresIn: '1h' }
            );

            const dataUser = {
                name: user.name,
                surname: user.surname,
                tephone: user.tephone,
                email: user.email,
            }

            res.status(200).json({ user: dataUser, token, message: 'You success verified' });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
)

// /api/auth/login
router.post('/login', 
    validateFormLogin,
    async (req, res) => {
        try { 

            const { email } = req.body;

            const user =  await Promise.resolve( User.findOne({ email }) );

            const token = jwt.sign(
                { userId: user._id }, 
                process.env.SECRET,  
                { expiresIn: '1h' }
            );

            const dataUser = {
                name: user.name,
                surname: user.surname,
                telphone: user.telphone,
                email: user.email,
            }

            res.status(200).json({ user: dataUser, token, message: 'You logined success' });

        } catch (error) {

            console.log(error)

            res.status(500).json({ message: 'Something went wrong' });
        }
    }
)

module.exports = router;