const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/admin')
const jwt = require('jsonwebtoken');
const authenticateToken = require('./auth');
const playlist = require('../models/playlist');
const Blog = require('../models/post') 
// const authenticateToken = require('./auth');
// const Post = require('../models/post');




const jwtSecret = process.env.JWTSECRET;

 


router.get('/', async (req, res) => {
    try {
        const text = {
            title: "Home",
            shfl: "What's On Shfl?"
        }
        let perPage = 1
        let page = req.query.page || 1;
        
        const spotify = await playlist.aggregate([{ $sort: { createdAt: -1 } }])
        
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        
            
        let perPost = 3
        let Postpage = req.query.page || 1;

        const post = await Blog.aggregate([{ $sort: { createdAt: -1 } }])
        
        .skip(perPost * Postpage - perPost)
        .limit(perPost)
        .exec();

        res.render('index', {layout: 'layouts/main', text, spotify, post})
    } catch (error) {
        console.log(error)
    }

})

router.get('/home', authenticateToken, async (req, res) => {
    const text = {
        title: "Home",
        shfl: "What's On Shfl?"
    }

    let perPage = 1
        let page = req.query.page || 1;
        
        const spotify = await playlist.aggregate([{ $sort: { createdAt: -1 } }])
        
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        
    res.render('index2', {layout: 'layouts/home', text, spotify})
})
 
router.get('/login', (req, res) => {
    const text = {
        title: "login"
    }
    res.render('admin/login', {layout: 'layouts/main', text} );
});

router.get('/register', (req, res) => {
    const text = {
        title: "register"
    }
    res.render('admin/register', {layout: 'layouts/main', text});
});





router.post('/register',  async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, email, password: hashedPassword });
            res.redirect('/login');
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: `user already exists` });
            } else {
                res.status(500).json({ message: `Internal Server Error` });
            }
        }
    } catch (e) {
        console.error(e);
    }
})

// login post


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        
        // Test for user existence
        const user = await User.findOne({ username });
        
        if (!user) {
            // const name = document.getElementById("errorMessage").innerHTML = "Incorrect Credentials"
            // return name;
            return res.status(401).json({ message: 'invalid credentials' });
        }

        // Compare the entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {        
            return res.status(401).json({ message: 'Invalid Credentials' });

        }

        // Generate a JWT token
        const token = jwt.sign({ userID: user._id }, jwtSecret, {expiresIn: '1h'});
        res.cookie('token', token, { httpOnly: true });


        
        // Redirect to home page
        res.status(200).json({ success: true, redirectUrl: '/dashboard' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred' });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token');  // Clear the token cookie
    res.status(200).json({ message: 'Logged out successfully', redirectUrl: '/login' });
});

// router.post('/',  async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // test for user existence
//         const user = User.findOne({ email });
        
//         if (!user) {
//             return res.status(401).json({
//                 message: `invalid credentials`
//             })
//         }

//          const isPasswordValid = await bcrypt.compare(user, user.password);

//         if (!isPasswordValid) {
//              return res.status(401).json({
//                 message: `invalid credentials`
//             })
//         }

//         const token = jwt.sign({ userID: user._id }, jwtSecret);
//         res.cookie('token', token, { httpOnly: true });

//         res.redirect('/')

//     } catch (e) {
//         console.error(e);
//     }

// });



module.exports = router