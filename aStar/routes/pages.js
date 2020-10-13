const express = require('express');
const User = require('../user.js');
const connection = require('../connection.js');
const router = express.Router();
const user = new User();
var userp = 'null';
var login,text,bind1={},title,cost,firma,type;

router.get('/',(req,res,next)=>{
  res.render('myindex.ejs',{name:userp});
});

router.get('/order',(req,res,next)=>{
  res.render('order.ejs',{name:userp});
});
router.get('/login',(req,res,next)=>{
  res.render('login.ejs')
});
router.get('/register',(req,res,next)=>{
  res.render('register.ejs');
});
router.get('/fball',(req,res,next)=>{

      res.render('fball.ejs',{name:userp,title:title,cost:cost,firma:firma,login,bind: bind1});
})



router.get('/loggout',(req,res,next)=>{
  if(req.session.user){
    req.session.destroy(function(){
      userp = 'null';
      res.redirect('/');
    })
  }
})
router.get('/football',(req,res,next)=>{
  res.render('football.ejs',{name:userp})
});

//добавление комментария
router.post('/fball',(req,res,next)=>{
  var bind=[];
  if(req.session.user && req.body.comment != ''){
    let tsql = `SELECT idu FROM users where login=?`;
    connection.query(tsql,req.session.user.login,function(err,result){
        bind.push(result[0]["idu"]);
    })
    let t2sql = `SELECT idp FROM products where title=?`;
    connection.query(t2sql,req.body["button"],function(err,result){
        bind.push(result[0]["idp"]);
    })
    bind.push(req.body.comment);
    setTimeout(function() {
    user.addcomments(bind,function(result){
    })},10);
  }
  else{
  res.redirect('/login');
}
res.redirect('/fball');
})

//страница отдельного предмета
router.post('/order',(req,res,next)=>{
  var bind = [];
  if(userp=='null'){
    res.redirect('/login');
  }
  else{
    user.checkidu(req.session.user.login,function(result){
      bind.push(result[0]["idu"]);
    })
    bind.push(req.body["type"]);
    user.checkprice(req.body["type"],function(result){
      bind.push(result[0]["price"]*req.body["quantity"]);
    });
    bind.push(req.body["quantity"]);
    bind.push(req.session.ido);
    setTimeout(function() {
    user.inbasket(bind,function(result){
      res.redirect('/');
    })},10);
  }
})



router.post('/login',(req,res,next)=>{

  user.login(req.body.login, req.body.pass, function(result){
      if(result) {
        req.session.user = result;
        req.session.opp = 1;
        req.session.ido = 1;
        userp = req.session.user.login;
        res.redirect('/');
      } else {
        res.send('Username/Password incorrect');
      }
  })
});
//Нажатие на кнопку купить
router.post('/',(req,res,next)=>{
  console.log(req.body.comment);
//обновления комментариев
  if(req.session.user && req.body.comment != '' && req.body.comment!=undefined){
    var bind=[];
    let tsql = `SELECT idu FROM users where login=?`;
    connection.query(tsql,req.session.user.login,function(err,result){
        bind.push(result[0]["idu"]);
    })
    let t2sql = `SELECT idp FROM products where title=?`;
    connection.query(t2sql,req.body["button"],function(err,result){
        bind.push(result[0]["idp"]);
    })
    bind.push(req.body.comment);
    setTimeout(function() {
    user.addcomments(bind,function(result){
    })},10);
    bind1[`${req.session.user.login}`] = req.body.comment;
    res.redirect('/fball')
  }
  //комментарии
else{
  bind1={};
  let sql1 = `select login,text from review inner join users on users.idu=review.idu inner join products on review.idp=products.idp where title=?`;
  connection.query(sql1,req.body["type"],function(err,result){
    console.log(result);
    if(result.length!=0){
      for(var i =0;i<result.length;i++){
        login = result[i]["login"];
        text = result[i]["text"];
        bind1[`${login}`] = text;
      }
  }
  else{
    login = "";
    text = "";
    bind1 = {};
  }
  })
//данные о вещи
  let sql = `SELECT title,price,firm.name FROM products inner join firm on products.idf=firm.idf WHERE title = ?`;
  connection.query(sql,req.body["type"],function(err,result){
    title = result[0]["title"];
    cost = result[0]["price"];
    firma = result[0]["name"];

  })
}
  res.redirect('/fball');
})

//регистрация
router.post('/register',(req,res,next)=>{

    let userInput = {
      mail: req.body.mail,
      login: req.body.login,
      pass: req.body.pass
    };
    user.create(userInput,function(lastId){
      if(lastId){
            res.redirect('/login');
      } else {
        console.log('Error creating new user');
      }})
});
module.exports=router;
