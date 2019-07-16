const path = require('path');
const express = require('express');
const multer = require('multer');
const hbs = require("hbs");


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));



//Set Storage Engine

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    
  }
});

//init upload

const upload = multer({
  storage: storage
}).single('MYIMG');




//Public Folder
app.use(express.static('/home/ubuntu/applications/public'));

app.get('/home/ubuntu/application/', (req, res)=>  res.render('tickets'));

app.post('/upload', (req, res) => {
 upload(req, res, (err) => {
   if(err){
     res.render('index', {
       msg: err
     });
   } else {
     console.log(req.file);
   }
 })
});
