var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

var loggedin=false;

/* GET home page. */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM productos ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('index', {data:'', dataCategories:''});
    } else {
      dbConn.query('SELECT * FROM categorias ORDER BY id asc',function(errcat,rowsCategories){
        if(errcat){
          req.flash('error', errcat);
          res.render('index', {data:rows, dataCategories:''});
        }else{
          res.render('index', {data:rows, dataCategories:rowsCategories});
        }
      });
    }
  })
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

/* GET aboutus page. */
router.get('/aboutus', function(req, res, next) {
  res.render('aboutus');
});
/* GET aboutus page. */
router.get('/ayuda', function(req, res, next) {
  res.render('ayuda');
});

/* GET contactus page. */
router.get('/contactus', function(req, res, next) {
  res.render('contactus');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* POST login page. */
router.post('/dashboard', function(req, res, next) {
  email=req.body.email;
  password=req.body.password;
  dbConn.query("SELECT * FROM usuarios WHERE email='"+email+"' AND PASSWORD='"+password+"'",function(err,rows){
    console.log(rows);
    if(err){
      req.flash('error',err);
      console.log(err);
    }else{
      if(rows.length && rows[0]["nivel"]=='ADMIN'){
        req.session.idu=rows[0]["id"];
        req.session.email=rows[0]["email"];
        req.session.loggedin=true;
        res.redirect('/dashboard');
      }else{
        if(rows.length && rows[0]["nivel"]=='USER'){
          req.session.idu=rows[0]["id"];
          req.session.email=rows[0]["email"];
          req.session.loggedin=true;
          res.redirect('/dashboard2');
        }else{
          req.flash('error','El usuario no existe...');
          res.redirect('/');
        }
      }
    }
  });
});
/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup',{
    email:'',
    password:'',
    nivel: 'USER'
  });
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {    
  let email = req.body.email;
  let password = req.body.password;
  let nivel = 'USER';
  let errors = false;

  if(email.length === 0) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('signup', {
        email: email,
        password: password,
        nivel: nivel
      })
  }

  // if no error
  if(!errors) {
      var form_data = {
        email: email,
        password: password,
        nivel: nivel
      }
      dbConn.query('INSERT INTO usuarios SET ?', form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('signup', {
                email: form_data.email                   
              })
          } else {                
              req.flash('success', 'Usuario registrado');
              res.redirect('/login');
          }
      })
  }
})

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/login');
  }
  res.render('dashboard');
});
router.get('/dashboard2', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/login');
  }
  res.render('dashboard2');
});

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect("/");  
});
module.exports = router;
