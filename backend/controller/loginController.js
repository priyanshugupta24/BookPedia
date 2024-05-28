const bcrypt = require("bcrypt");
var dotenv = require('dotenv').config();
const cookieParser = require("cookie-parser");
const { sequelize } = require('../database');
const { User } = require('../model/user.model');
const { sign } = require("jsonwebtoken");

const secret = process.env.JWTSECRET;
const hashno = process.env.HASHNO;

var register = async (req, res) => {
    const { name, email, password, is_seller } = req.body;

    try {
        await sequelize.authenticate();

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ err: `Account with email ${email} already exists.` });
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(hashno));

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            is_seller: is_seller,
        });

        res.json(`New User with email - ${email} is registered!!`);

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const createToken = (user) => {
    const accessToken = sign({ username : user.email , id : user.id,is_seller : user.is_seller},secret);
    return accessToken;
}
const login = async(req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await User.findOne({ where: { email: email } });

    if (!existingUser) res.status(400).json({ err: "User Does Not Exist." });
    else {
        bcrypt.compare(password, existingUser.password).then((match) => {
            if (!match) res.status(400).json({ err: "Password is wrong." });
            else {
                const accessToken = createToken(existingUser);
                const userInfo = {
                    email: existingUser.email,
                    id : existingUser.id,
                    is_seller : existingUser.is_seller
                }
                const options = {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
                    httpOnly: true,
                    secure: false,
                    sameSite: "none",
                }
                res.cookie("access-token", accessToken, { maxAge: 2592000000 });
                res.json({ token: accessToken, auth: true, msg: `User with email - ${userInfo.username} is Logged In!!` });
            }
        })
    }
}
var logout = (req, res) => {
    res.clearCookie('access-token', { maxAge: 2592000000 });
    res.clearCookie('user-info', { maxAge: 2592000000 });
    res.status(200).send('Logged out successfully');
}

module.exports = { login, logout, register };
