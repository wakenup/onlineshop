const express = require('express');
const session = require('express-session');
const PORT = 3000;
const pagesRouter = require('./routes/pages');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('view-engine','ejs');
//bodyparsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'public')));
//
app.use(session({
  secret:'project',
  resave:false,
  saveUninitialized: false,
  cookie : {
  }
}))
//pages
app.use('/',pagesRouter);

//errors
app.use((req,res,next)=>{
  var err = new Error('Page not found');
  err.status = 404;
  next(err);
})

//handling errors
app.use((err,req,res,next)=>{
  res.status(err.status || 500);
  res.send(err.message);
})

//server
app.listen(PORT,()=>{console.log("Server has been started")})


module.exports = app;
