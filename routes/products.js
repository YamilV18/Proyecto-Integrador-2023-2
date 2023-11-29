var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM productos ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('products/index',{data:''});   
        } else {
            res.render('products/index',{data:rows});
        }
    })
});

router.get('/add', function(req, res, next) {    
    res.render('products/add', {
        nombre: '',
        descripcion: '',
        foto: '',
        stock: '',
        precio: '',
        categoria: ''
    })
  })

  router.post('/add', function(req, res, next) {    
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    let foto = req.body.foto;
    let stock = req.body.stock;
    let precio = req.body.precio;
    let categoria = req.body.categoria;
    let errors = false;
  
    if(nombre.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('products/add', {
          nombre: nombre,
          descripcion: descripcion,
          foto: foto,
          stock: stock,
          precio: precio,
          categoria: categoria
        })
    }
  
    // if no error
    if(!errors) {
        var form_data = {
          nombre: nombre,
          descripcion: descripcion,
          foto: foto,
          stock: stock,
          precio: precio,
          CATEGORIAS_id: categoria
        }
        dbConn.query('INSERT INTO productos SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('products/add', {
                    name: form_data.nombre                   
                })
            } else {                
                req.flash('success', 'Producto agregado');
                res.redirect('/products');
            }
        })
    }
  })
  router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('SELECT * FROM productos WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'No se encontró el registro con id = ' + id)
            res.redirect('/products')
        }
        else {
            res.render('products/edit', {
                id: rows[0].id,
                nombre: rows[0].nombre,
                descripcion: rows[0].descripcion,
                foto: rows[0].foto,
                stock: rows[0].stock,
                precio: rows[0].precio,
                categoria: rows[0].CATEGORIAS_id
            })
        }
    })
  })

  router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    let foto = req.body.foto;
    let stock = req.body.stock;
    let precio = req.body.precio;
    let categoria = req.body.categoria;
    let errors = false;
  
    if(nombre.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('products/edit', {
            id: req.params.id
        })
    }
  
    if( !errors ) {   
        var form_data = {
          nombre: nombre,
          descripcion: descripcion,
          foto: foto,
          stock: stock,
          precio: precio,
          CATEGORIAS_id: categoria
        }
        dbConn.query('UPDATE productos SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('products/edit', {
                    id: req.params.id,
                    nombre: form_data.nombre
                })
            } else {
                req.flash('success', 'Registro actualizado');
                res.redirect('/products');
            }
        })
    }
  })

  router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM productos WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/products')
        } else {
            req.flash('success', 'Registro eliminado con ID = ' + id)
            res.redirect('/products')
        }
    })
  })

module.exports = router;
