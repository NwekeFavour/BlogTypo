const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const path = require('path')
const fs = require('fs');
const authenticateToken = require('./auth');

// const upload = multer({ dest: '/uploads'})

// function insertPost() {
//     Post.insertMany([
//         {
//             image: "http://localhost:5000/images/shfl3.png",
//             title: "Our Official First Post",
//             description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam excepturi quibusdam facere cumque provident natus autem debitis accusantium impedit! Aspernatur eius similique consectetur totam aut vero ipsum impedit a. Voluptatibus Consequatur, quis distinctio! Repellendus veniam numquam ipsam quaerat vitae vero, inventore consequatur. Porro, quod! Nobis voluptatum sint molestiae earum consectetur incidunt! Expedita, quae magnam ad possimus quia minus porro quo?"
//         },
//          {
//             image: "http://localhost:5000/images/shfl3.png",
//             title: "Our Official First Post",
//             description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam excepturi quibusdam facere cumque provident natus autem debitis accusantium impedit! Aspernatur eius similique consectetur totam aut vero ipsum impedit a. Voluptatibus Consequatur, quis distinctio! Repellendus veniam numquam ipsam quaerat vitae vero, inventore consequatur. Porro, quod! Nobis voluptatum sint molestiae earum consectetur incidunt! Expedita, quae magnam ad possimus quia minus porro quo?"
//         },
//           {
//             image: "http://localhost:5000/images/shfl3.png",
//             title: "Our Official First Post",
//             description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam excepturi quibusdam facere cumque provident natus autem debitis accusantium impedit! Aspernatur eius similique consectetur totam aut vero ipsum impedit a. Voluptatibus Consequatur, quis distinctio! Repellendus veniam numquam ipsam quaerat vitae vero, inventore consequatur. Porro, quod! Nobis voluptatum sint molestiae earum consectetur incidunt! Expedita, quae magnam ad possimus quia minus porro quo?"
//         },
//            {
//             image: "http://localhost:5000/images/shfl3.png",
//             title: "Our Official First Post",
//             description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam excepturi quibusdam facere cumque provident natus autem debitis accusantium impedit! Aspernatur eius similique consectetur totam aut vero ipsum impedit a. Voluptatibus Consequatur, quis distinctio! Repellendus veniam numquam ipsam quaerat vitae vero, inventore consequatur. Porro, quod! Nobis voluptatum sint molestiae earum consectetur incidunt! Expedita, quae magnam ad possimus quia minus porro quo?"
//         },
//             {
//             image: "http://localhost:5000/images/shfl3.png",
//             title: "Our Official First Post",
//             description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam excepturi quibusdam facere cumque provident natus autem debitis accusantium impedit! Aspernatur eius similique consectetur totam aut vero ipsum impedit a. Voluptatibus Consequatur, quis distinctio! Repellendus veniam numquam ipsam quaerat vitae vero, inventore consequatur. Porro, quod! Nobis voluptatum sint molestiae earum consectetur incidunt! Expedita, quae magnam ad possimus quia minus porro quo?"
//         }
//     ])
// }

// insertPost();

router.get('/post', (req, res) => {
    const text = {
        title: "upload"
    }
    res.render('post', {text});
})

router.get('/blogs', async (req, res) => {
    const text = {
        title: "blog"
    }
    
    try {
        const blog = await Post.find();
        res.render('blog', {blog, text});
        
    } catch (error) {
        console.log(error);
    }
    
})

router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const blog = await Post.find();
        res.render('dashboard', {layout: 'layouts/admin', blog} );
        
    } catch (error) {
        console.log(error);
    }
})


// router.post('/upload',  (req, res) => {
//     const blog = new Post(req.body);

//     blog.save()
//     .then((result) => {
//         res.redirect('/');
//     }).catch((err) => {
//         console.log(err);
//     });
// })



const storage = multer.diskStorage({
    destination: './servers/routes/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
    
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2000000 } // 2MB file size limit
}).single('image');

router.post('/upload', (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }

        try {
            const { title, description } = req.body;
            if (!req.file) {
                return res.status(400).json({ message: 'File is required' });
            }

            const image = {
                data: fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename)).toString('base64'),
                contentType: req.file.mimetype
            };

            const blog = new Post({
                title,
                description,
                image
            });

            await blog.save(); 
            res.redirect('/blogs');

        } catch (error) {
            console.error('Error while saving post:', error);
            res.status(500).json({ message: 'An error occurred while saving the post', error: error.message });
        }
    });
});


router.get('/blogs/:id', (req, res) => {
    const text = {
        title: "article"
    }
    const id = req.params.id
    Post.findById(id)
    .then((result) => {
        res.render('details', {post : result, text});
    }).catch((err) => {
        console.log(err);
    });
})



router.delete('/blogs/:id', (req, res) => {
    const id = req.params.id
    Post.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect: '/'});
    }).catch((err) => {
        console.log(err);
    });
})

module.exports = router;

 