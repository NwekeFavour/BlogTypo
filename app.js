require('dotenv').config();
// const { URL } = require('whatwg-url');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const connectDB = require('./servers/config/db');
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path')
const helmet = require('helmet')


app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static('public'));
// for the update put request to override the method to upload route
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    // res.header('Content-Security-Policy', "default-src 'self'; style-src 'self' https://fonts.googleapis.com;")
    // res.header('Content-Security-Policy', "default-src 'self'; style-src-elem 'self' https://fonts.googleapis.com;")
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Content-Security-Policy', "default-src 'self'; img-src 'self' data:;");
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
      // Add other directives as needed
    },
  })
);

app.set('layout', './layouts/main');

app.use('/', require('./servers/routes/main'));
app.use('/', require('./servers/routes/post'));

app.use((req, res, next) => { 
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    next();     
});
     
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send('Hello World');
})

connectDB();

app.listen(PORT, () => {
    console.log(`server connected sucessfully : ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})  