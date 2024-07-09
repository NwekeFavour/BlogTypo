const express = require('express')
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
app.use(cookieParser());


const jwtSecret = process.env.JWTSECRET;


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
         const text = {
        title: "login"
    }
    res.render('admin/login', {layout: 'layouts/main', text} );
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.userID; // Assuming you store user ID in the token payload
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error);
        res.render('admin/login', {layout: 'layouts/main', text} );
    }
};

module.exports = authenticateToken