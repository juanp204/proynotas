const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

//configuracion
app.set('port', 80);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//var.session
const session = require('express-session')
app.use(session({
    secret:'nosenosesecret123',
    resave: true,
    saveUninitialized:true
}));

//DB
const conectado = require('./database/db');
const req = require('express/lib/request');

//rutas
app.use(require('./routes/routes.js'));


//server
app.listen(app.get('port'),()=>{
    console.log("server on :"+app.get('port'));
});