var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

var loggedin=false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET aboutus page. */
router.get('/aboutus', function(req, res, next) {
  res.render('aboutus');
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
  email=req.body.username;
  password=req.body.password;
  dbConn.query("SELECT * FROM usuarios WHERE email='"+email+"' AND PASSWORD='"+password+"'",function(err,rows){
    console.log(rows);
    if(err){
      req.flash('error',err);
      console.log(err);
    }else{
      if(rows.length){
        req.session.idu=rows[0]["id"];
        req.session.email=rows[0]["email"];
        req.session.loggedin=true;
        res.redirect('/dashboard');
      }else{
        req.flash('error','El usuario no existe...');
        res.redirect('/');
      }
    }
  });
});
/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {    
  let email = req.body.email;
  let password = req.body.password;
  let errors = false;

  if(email.length === 0) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('signup', {
        email: email
      })
  }

  // if no error
  if(!errors) {
      var form_data = {
        email: email,
        password: password,
        nivel: 'USER'
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

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect("/");  
});
module.exports = router;
