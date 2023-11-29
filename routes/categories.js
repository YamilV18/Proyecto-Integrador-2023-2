var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM categorias ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('categories/index',{data:''});   
        } else {
            res.render('categories/index',{data:rows});
        }
    })
});
/* VER FORMULARIO ADD */
router.get('/add', function(req, res, next) {    
    res.render('categories/add', {
        nombre: ''       
    })
  })
  
  /* INSERTAR EN BASE DE DATOS */
  router.post('/add', function(req, res, next) {    
    let nombre = req.body.nombre;
    let errors = false;
  
    if(nombre.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('categories/add', {
          nombre: nombre
        })
    }
  
    // if no error
    if(!errors) {
        var form_data = {
          nombre: nombre
        }
        dbConn.query('INSERT INTO categorias SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('categories/add', {
                    name: form_data.nombre                   
                })
            } else {                
                req.flash('success', 'Categoría agregada');
                res.redirect('/categories');
            }
        })
    }
  })
  
  /* VER FORMULARIO EDITAR */
  router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('SELECT * FROM categorias WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'No se encontró el registro con id = ' + id)
            res.redirect('/categories')
        }
        else {
            res.render('categories/edit', {
                id: rows[0].id,
                nombre: rows[0].nombre
            })
        }
    })
  })
  
  /* ACTUALIZAR FORMULARIO BASE DE DATOS */
  router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let nombre = req.body.nombre;
    let errors = false;
  
    if(nombre.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('categories/edit', {
            id: req.params.id,
            nombre: nombre
        })
    }
  
    if( !errors ) {   
        var form_data = {
          nombre: nombre
        }
        dbConn.query('UPDATE categorias SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('categories/edit', {
                    id: req.params.id,
                    nombre: form_data.nombre
                })
            } else {
                req.flash('success', 'Registro actualizado');
                res.redirect('/categories');
            }
        })
    }
  })
  
  /* ELIMINAR REGISTRO BASE DE DATOS */
  router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM categorias WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/categories')
        } else {
            req.flash('success', 'Registro eliminado con ID = ' + id)
            res.redirect('/categories')
        }
    })
  })
    
module.exports = router;
