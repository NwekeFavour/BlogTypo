const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const path = require('path')
const fs = require('fs');
const authenticateToken = require('./auth');
const User = require('../models/admin');
const { title } = require('process');
const NextB = require('../models/nextGen');
const playlist = require('../models/playlist');
const Nextbeats = require('../models/nextGen');
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
    res.render('post', {text, layout: 'layouts/admin'});
})

router.get('/blog', async (req, res) => {
    const text = {
        title: "blog"
    }    
    try {
        const blog = await Post.find();
        res.render('blog', {blog, text, layout: 'layouts/main'});
        
    }
    catch (error) {
        console.log(error);
    }    
})

router.get('/dashboard', authenticateToken, async (req, res) => {
        const text = {
                title: "dashboard"
            }
    try {
       
        const blog = await Post.find();
        res.render('dashboard', {text, layout: 'layouts/admin', blog} );
    } 
    catch (error) {
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


 // Check if a new image file is uploaded
            // if (req.file) {
            //     const image = {
            //         data: fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename)).toString('base64'),
            //         contentType: req.file.mimetype
            //     };
            //     updatedData.image = image
            // }


const storage = multer.diskStorage({
    destination: './servers/routes/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }    
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2000000 } // 2MB file size limit
}).fields([
    { name : 'image', maxCount: 1},
    { name : 'optionalimage', maxCount: 1}
]);

router.post('/upload', (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }

        try {
            const { title, description } = req.body;
            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: 'Main image is required' });
            }

            const image = {
                data: fs.readFileSync(path.join(__dirname, 'uploads', req.files.image[0].filename)).toString('base64'),
                contentType: req.files.image[0].mimetype
            };

            let optionalimage = null;
            if (req.files.optionalimage) {
                optionalimage = {
                    data: fs.readFileSync(path.join(__dirname, 'uploads', req.files.optionalimage[0].filename)),
                    contentType: req.files.optionalimage[0].mimetype
                };
            }
                
            const blog = new Post({
                title,
                description,
                image, 
                optionalimage
            });

            await blog.save(); 
            res.redirect('/dashboard')

        } catch (error) {
            console.error('Error while saving post:', error);
            res.status(500).json({ message: 'An error occurred while saving the post', error: error.message });
        }
    });
});


router.get('/blog/:id', async (req, res) => {
     const text = {
        title: "article"
    }

    // const { username, password } = req.body;

        
        // Test for user existence
//         const user = await User.findOne({ username });
//   const username = user.username;
    const id = req.params.id
    const post = Post.findById(id)
    .then((result) => {
        res.render('details', { post: result, text });
        // console.log(username)
    }).catch((err) => {
        console.log(err);
    });
})

router.get('/update/:id', async (req, res) => {
    try {
       
     const text = {
        title: "update-post"
       }
       const post = await Post.findOne({ _id: req.params.id})
       res.render('update',
           {
               post,
               text
           })
   } catch (err) {
    console.error(err)
   }
    
})

const UpdateStorage = multer.diskStorage({
    destination: './servers/routes/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const update = multer({
    storage: UpdateStorage,
    limits: { fileSize: 2000000 } // 2MB file size limit
}).single('image');

router.put('/update/:id', (req, res) => {
    update(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File update error', error: err.message });
        }
        try {
            const id = req.params.id;
            const { title, description } = req.body;

            const updatedData = {
                title,
                description,
                updatedAt: Date.now()
            };

            if (req.file) {
                const image = {
                    data: fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename)).toString('base64'),
                    contentType: req.file.mimetype
                }
                    updatedData.image = image
            } else {
                console.log('No file uploaded');
            }

            const blog = await Post.findByIdAndUpdate(id, updatedData, { new: true });

            if (!blog) {
                return res.status(404).send('Post not found');
            }

            res.redirect('/dashboard');
        } catch (error) {
            console.error('Error while updating post:', error);
            res.status(500).json({ message: 'An error occurred while updating the post', error: error.message });
        }
    });
});

router.delete('/blog/:id', async (req, res) => {
    const id = req.params.id
    Post.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect: '/dashboard'});
    }).catch((err) => {
        console.log(err);
    });
})


router.get('/nextbeats/upload', (req, res) => {
    const text = {
        title: "nextbeats-upload"
    }
    res.render('nextgen', {
        text,
        layout: "layouts/admin"
    });
})

router.get('/nextbeats/dashboard', authenticateToken, async (req, res) => {
    try {
        const text = {
            title: "Nextbeats Dashboard"
        };

        // Fetch the latest document based on createdDate
        const nextbeatPost = await Nextbeats.find();

        res.render('nextbeats/dashboard', { text, layout: "layouts/admin", nextbeatPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while fetching profiles' });
    }
});

router.get('/nextbeats/profiles', async (req, res) => {
    const text = {
        title : "Nextbeats-Profiles"
    }

    const Profiles = await Nextbeats.find()

    res.render('nextbeats/profiles', {text, Profiles, layout: "layouts/admin"})
})



router.get('/nextbeats', async (req, res) => {
    const text = {
        title: "nextbeats"
    }
    try {
        const nextb = await NextB.find();
        res.render('nextbeats/nextb', {nextb, text, layout: 'layouts/main'});
    }
    catch (error) {
        console.log(error);
    } 
})

const Nextbeatsstorage = multer.diskStorage({
    destination: './servers/routes/nextbeats/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }    
});

const nextbeats = multer({ 
    storage: Nextbeatsstorage,
    limits: { fileSize: 2000000 } // 2MB file size limit
})

router.post('/nextbeats-post', nextbeats.fields([{ name: 'profileimage', maxCount: 8 }, { name: 'coverimage', maxCount: 1 }]), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    try {
        const profiles = JSON.parse(req.body.profiles); // Assuming profiles is a JSON string
        const { title } = req.body;

        const coverimage = {
            data: fs.readFileSync(path.join(__dirname, 'nextbeats', req.files['coverimage'][0].filename)),
            contentType: req.files['coverimage'][0].mimetype
        };

        const artists = profiles.map((profile, index) => {
            const profileimage = {
                data: fs.readFileSync(path.join(__dirname, 'nextbeats', req.files['profileimage'][index].filename)),
                contentType: req.files['profileimage'][index].mimetype
            };

            return {
                name: profile.name,
                about: profile.about,
                link: profile.link,
                ref: profile.ref,
                profileimage
            };
        });

        // Save the document
        const monthlyProfiles = new Nextbeats({
            title,
            coverimage,
            profiles: artists,
            month: new Date().getMonth() + 1, // Current month
            year: new Date().getFullYear() // Current year
        });

        await monthlyProfiles.save();

        res.status(200).json({ message: 'Profiles added successfully' });
    } catch (error) {
        console.error('Error while saving profiles:', error);
        res.status(500).json({ message: 'An error occurred while saving the profiles', error: error.message });
    }
});



// router.post('/nextbeats-post', nextbeats.fields([{ name: 'profileimage', maxCount: 8 }, { name: 'coverimage', maxCount: 1 }]), async (req, res) => {
//     console.log('Request Body:', req.body);
//     console.log('Request Files:', req.files);

//     try {


//         const profiles = JSON.parse(req.body.profiles); // Assuming profiles is a JSON string
//         const { title } = req.body
        
//         const coverimage = {
//             data: fs.readFileSync(path.join(__dirname, 'nextbeats', req.files['coverimage'][0].filename)),
//             contentType: req.files['coverimage'][0].mimetype
//         };

//         const artists = profiles.map((profile, index) => {
//             const profileimage = {
//                 data: fs.readFileSync(path.join(__dirname, 'nextbeats', req.files['profileimage'][index].filename)),
//                 contentType: req.files['profileimage'][index].mimetype
//             };

//             return new NextB({
//                 title,
//                 coverimage,
//                 profileimage,
//                 name: profile.name,
//                 ref: profile.ref,
//                 link: profile.link,
//                 about: profile.about
//             });
//         });

//          const now = new Date();
//         const month = now.toLocaleString('default', { month: 'long' });
//         const year = now.getFullYear();

//         let monthlyProfiles = await Nextbeats.findOne({ month, year });

//         if (monthlyProfiles) {
//             // Add profiles to the existing document
//             monthlyProfiles.profiles.push(...profileDocs);
//         } else {
//             // Create a new document for the current month
//             monthlyProfiles = new Nextbeats({
//                 month,
//                 year,
//                 profiles: artists
//             });
//         }

//         await monthlyProfiles.save();

        


//         // await NextB.insertMany(artists);


//         res.status(200).json({ message: 'Profiles added successfully' });
//     } catch (error) {
//         console.error('Error while saving profiles:', error);
//         res.status(500).json({ message: 'An error occurred while saving the profiles', error: error.message });
//     }
// });

// router.get('/nextbeats/:id', async (req, res) => {
//     try {
       
//      const text = {
//         title: "nextbeats-update"
//        }
//        const nextb = await NextB.findOne({ _id: req.params.id})
//        res.render('nextbeats/edit-nextbeats',
//            {
//                nextb,
//                text,
//                layout: "layouts/admin"
//            })
//    } catch (err) {
//     console.error(err)
//    }
    
// })

// const nextbupdateStorage = multer.diskStorage({
//     destination: './servers/routes/nextbeats/',
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const nextbeatupdate = multer({
//     storage: nextbupdateStorage,
//     limits: { fileSize: 2000000 } // 2MB file size limit
// }).fields([
//     { name : 'image', maxCount: 1},
//     { name : 'coverimage', maxCount: 1}
// ]);

// router.put('/nextbeats/:id', (req, res) => {
//     nextbeatupdate(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: 'File update error', error: err.message });
//         }
//         try {
//             const id = req.params.id;
//             const { title, name, ref, link, about } = req.body;

//             const updatednextB = {
//                 title,
//                 name,
//                 ref,
//                 link,
//                 about
//             };

//             if (req.files) {
//                 const image = {
//                     data: fs.readFileSync(path.join(__dirname, 'nextbeats', req.files.image[0].filename)).toString('base64'),
//                     contentType: req.files.image[0].mimetype
//                 }
//                     updatednextB.image = image
//             } else {
//                 console.log('No file uploaded');
//             }

//             if (req.files) {
//                 const coverimage = {
//                     data: fs.readFileSync(path.join(__dirname, 'nextbeats', req.files.coverimage[0].filename)).toString('base64'),
//                     contentType: req.files.coverimage[0].mimetype
//                 }
//                     updatednextB.coverimage = coverimage
//             } else {
//                 console.log('No file uploaded');
//             }

//             const nextb = await NextB.findByIdAndUpdate(id, updatednextB, { new: true });

//             if (!nextb) {
//                 return res.status(404).send('Post not found');
//             }

//             res.redirect('/nextbeats/dashboard');
//         } catch (error) {
//             console.error('Error while updating nextbeat:', error);
//             res.status(500).json({ message: 'An error occurred while updating the post', error: error.message });
//         }
//     });
// });


router.get('/playlist', (req, res) => {
    const text = {
        title: "playlist"
    }
    res.render('playlist', {text, layout: "layouts/admin"})    
})

const playlistStorage = multer.diskStorage({
    destination: './servers/routes/playlist/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }    
});

const Uploadplaylist = multer({ 
    storage: playlistStorage,
    limits: { fileSize: 2000000 } // 2MB file size limit
}).single('image')

router.post('/playlist/upload',  (req, res) => {
    
    Uploadplaylist(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }
        try {           
            const { playlistname, link } = req.body
            if (!req.file) {
                return res.status(400).json({ message: 'Main image is required' });
            }
            
            const image = {
               data: fs.readFileSync(path.join(__dirname, 'playlist', req.file.filename)).toString('base64'),                 
               contentType: req.file.mimetype
           }
           
            const Playlist = new playlist({
                link,
                playlistname,
                image
            });

        await Playlist.save()
        res.redirect("/playlist")
        } catch (error) {
            console.log(error)
        }
   })
})

module.exports = router;

 