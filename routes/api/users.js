const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');
const User = require("../../models/User");

router.post('/', [
    body('name', 'Please enter your name').not().isEmpty(),
    body('email', 'Please enter a valid email').isEmail().not().isEmpty(),
    body('password', 'Please enter up to at least 8 characters').isLength({
        min: 8
    })
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, country, language, category } = req.body;

    try {
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists. '}]});
        }

        user = new User({
            name,
            email,
            password,
            country,
            language,
            category
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err
                res.json({ token })
            }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router;