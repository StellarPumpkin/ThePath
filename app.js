const express = require('express');
const ejs = require ('ejs');
const path = require ('path');
const sequelize = require ('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/views')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({
    extended:true
}));

app.get('/', (req, res) => {
    res.render('pre-home')
});

app.get('/index', (req,res) => {
    res.render('index')
})

app.get('/makeyourown', (req,res) => {
    res.render('makeyourown')
})

app.get('/existingpath', (req,res) => {
    res.render('existingpath')
})



app.listen(port, () => console.log(`always ears on ${port}, my dear`));