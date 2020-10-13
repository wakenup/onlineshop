const connection = require('./connection');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
function User() {};

User.prototype = {
    find : function(user = null,callback)
    {
      if(user){
        var field = Number.isInteger(user) ? 'id' : 'login';
      }
      let sql = `SELECT * FROM users WHERE ${field} = ?`;
      connection.query(sql,user,function(err,result){
        if(err) throw err
        if(result.length){
          callback(result[0]);
        }else{
        callback(null);}
      })
    },

    create:function(body,callback)
    {
      let pwd = body.pass;
      body.pass =  crypto.createHash('md5').update(body.pass).digest('hex');
      var bind =[];
      for(prop in body){
        bind.push(body[prop]);
      }

      let sql = `INSERT INTO users(mail,login,pass) VALUES (?,?,?)`;

      connection.query(sql,bind,function(err,lastId){
        if(err) throw err;
        callback(lastId);
      });
    },

    login : function(login,pass,callback){
      this.find(login,function(user){
        if(user){
          let p = crypto.createHash('md5').update(pass).digest('hex');
          if(p==user.pass){
            callback(user);
            return;
          }
        }
        callback(null);
      })
    },

    checkidu : function(login,callback){
      let tsql = `SELECT idu FROM users WHERE login = ?`;
      connection.query(tsql,login,function(err,result){
        if(err) throw err
        callback(result);
      })
    },
    checkprice : function(title,callback){
      let t2sql = `SELECT price FROM products WHERE title = ?`;
      connection.query(t2sql,title,function(err,result){
        if(err) throw err
        callback(result);
      })
    },
    inbasket : function(bind,callback){
      let sql = `INSERT INTO basket(title,quantity,ido,idu,price) VALUES (?,?,?,?,?)`;
      connection.query(sql,bind,function(err,result){
        if(err) throw err;
        callback(null);
      })
    },
    addcomments : function(bind,callback){
      let sql = `INSERT INTO review(text,idu,idp) VALUES (?,?,?)`;
      connection.query(sql,bind,function(err,result){
         if(err) throw err;
          callback(null);
      })
    },
};


module.exports = User;
