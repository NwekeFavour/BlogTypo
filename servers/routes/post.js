const express = require('express');
const router = express.Router();
const Post = require('../models/post');
// const multer = require('multer');
// const fs = require('fs')

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
    res.render('post');
})

router.get('/blogs', async (req, res) => {
    
    try {
        const blog = await Post.find();
        res.render('blog', {blog});
        
    } catch (error) {
        console.log(error);
    }
    
})

router.post('/upload', async (req, res) => {
    const blog = new Post(req.body)
    blog.save()
    .then((result) => {
        res.redirect('/')
    }).catch((err) => {
        console.log(err)
    });
})

// router.post('/upload',
//     upload.single('image'),
//     async (req, res) => {
//         try {
//             const { title, description } = req.body;
//             const imageBuffer = fs.readFileSync(req.file.path);

            
//             const blog = new Post({
//                 title,
//                 description,
//                 image: imageBuffer,
//                 imageType
//             });
//              await blog.save()
                
//         } catch (error) {
//             console.log(error);
//         }

// }) 





module.exports = router;