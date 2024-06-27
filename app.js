require('dotenv').config();
const express = require('express');
// const expressLayout = require('express-ejs-layouts')
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./servers/config/db');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.use(express.static('public'));
app.use("/", express.static('./node_modules/bootstrap/dist/'));
app.set('layout', './layouts/admin');
app.use('/', require('./servers/routes/main'));
app.use('/', require('./servers/routes/post'));


app.set('view engine', 'ejs');

const PORT = 5000 || process.env.PORT;


app.get('/', function (req, res) {
    res.send('Hello World');
})

connectDB();


app.listen(PORT, () => {
    console.log(`server connected sucessfully : ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})