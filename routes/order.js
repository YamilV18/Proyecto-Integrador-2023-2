var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM pedido ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('order/index',{data:''});   
        } else {
            res.render('order/index',{data:rows});
        }
    })
});
module.exports = router;