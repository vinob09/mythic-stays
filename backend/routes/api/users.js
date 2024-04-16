const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('username')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Username is required'),
    check('firstName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// sign up a new user
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    // check if email exists
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
        return res.status(500).json({
            message: 'User already exists',
            errors: {
                email: 'User with that email already exists'
            }
        });
    }

    // check if username exists
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
        return res.status(500).json({
            message: 'User already exists',
            errors: {
                email: 'User with that username already exists'
            }
        });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});




module.exports = router;
