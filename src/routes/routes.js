const express = require('express');
const router = express.Router();
const path = require('path');
const conectado = require('../database/db.js');
const session = require('express-session');


const route = __dirname.slice(0,-6);
console.log(route);

// ------- html

router.get('/', async (req, res) => {

    if(req.session.user == undefined){
        res.redirect('/init')
    }
    else if(req.session.loggedin){

        conectado.query("SELECT nombre_materia FROM notas inner join materias on notas.ID_Materias = materias.ID WHERE ID_Usuarios = ? and notas.Numero = 0",[req.session.idu], async (error, results)=>{
            console.log(results)
            const user = req.session.user
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/index.html'), {us: user, res: con});
        })

    }

});

router.get('/init', async (req, res) => {
    const user = req.session.user
    const id = req.session.tipeuser
    res.render(path.join(route,'views/init.html'), {us: user, id: id});

});

//cambiar numero por porcentaje
router.get('/notas/:nom', (req, res) => {
    const idmat = req.params["nom"]
    const user = req.session.user
    const id = req.session.idu
    const con = `${JSON.stringify(results)}`;
    conectado.query(`SELECT * FROM notas inner join  WHERE ID_Usuarios = '' and notas.Numero > 0`, async (error, results)=>{

        res.send({'results': results});

    })
});

router.get('/registrarse', async (req, res) => {
    res.render(path.join(route,'views/registrarse.html'));
});


router.get('/perfil/:nom', async (req, res) => {
    conectado.query("SELECT us_nickname,us_nombres,us_apellidos,us_fecha_nacimiento,us_correo,us_id_uni,us_universidad,us_facultad,us_semestre FROM usuario WHERE us_nickname = ?",[req.params["nom"]], async (error, results)=>{
        const user = req.session.user
        const nom = req.params["nom"]
        const id = req.session.tipeuser
        //const
        if(results.length==0){
            res.redirect('/')
        }
        else{
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/perfil.html'), {res: con, us: user, id: id, nom:nom});
        }
    })
});


//------- css

router.get('/bootstrap.css', async (req, res) => {
    res.sendFile(path.join(route,'css/bootstrap.css'));
});

router.get('/bootstrap.min.css', async (req, res) => {
    res.sendFile(path.join(route,'css/bootstrap.min.css'));
});

router.get('/estilos.css', async (req, res) => {
    res.sendFile(path.join(route,'css/estilos.css'));
});

// ------ js

router.get('/decodehtml.js', async (req, res) => {
    res.sendFile(path.join(route,'scripts/decodehtml.js'));
});

// ----------- post


router.get('/cerrar', async (req, res) => {
    req.session.destroy();
    res.redirect('/')
});

router.post('/auth', async (req, res)=>{
    const users = req.session.user
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(user)
    if(user != "" && pass != ""){
        conectado.query('SELECT * FROM usuarios WHERE us_nickname = ?',[user], (error, results)=>{
            console.log(results)
            if(error || results.length == 0 || pass!=results[0].password){
                res.render(path.join(route,'views/init.html'),{
                    us: users,
                    alert:true,
                    alertTitle:"Error",
                    alertMessage: "Usuario y/o password incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer:false
                });
            }
            else{
                req.session.loggedin = true;
                req.session.user = results[0].us_nickname;
                req.session.idu = results[0].ID;
                res.redirect('/')
            }
        });
    }
    else{
        res.render(path.join(route,'views/init.html'),{
            us: users,
            alert:true,
            alertTitle:"Error",
            alertMessage: "Campos vacios",
            alertIcon: "error",
            showConfirmButton: true,
            timer:false
        });
    }
    
});

router.post('/register', (req, res)=>{
    const user = req.body.name;
    const name = req.body.nombres;
    const apell = req.body.apellidos;
    const pass = req.body.pass;
    const email = req.body.email;
    console.log(user)
    if(user!="" & name!="" & pass!="" & apell!="" & email!=""){
        conectado.query(`SELECT * FROM usuarios WHERE us_nickname = '${user}' OR us_correo = '${email}'`, async (error, results)=>{
            console.log(results)
            if(results.length == 0){
                conectado.query('INSERT INTO usuarios SET ?', {us_nickname:user, password:pass, nombre:name, apellido:apell, us_correo:email}, async(error,result)=>{
                    if(error){
                        console.log(error)
                        res.render(path.join(route,'views/registrarse.html'),{
                            
                            alert:true,
                                alertTitle:"Error",
                                alertMessage: "ocurrio un error inesperado",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer:false
                        });
                    }
                    else{
                        res.redirect("/init");
                    }
                })
            }
            else{
                res.render(path.join(route,'views/registrarse.html'),{
                    alert:true,
                        alertTitle:"Error",
                        alertMessage: "User o Email ya ocupado",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer:false
                });
            }
        })
    }
    else{
        res.render(path.join(route,'views/registrarse.html'),{
            alert:true,
                alertTitle:"Error",
                alertMessage: "Espacios vacios",
                alertIcon: "error",
                showConfirmButton: true,
                timer:false
        });
    }
})

// cambiar Numero por porcentaje
router.post('/agregarmateria', (req, res)=>{
    const materia = req.body.nmateria;
    const id = req.session.idu;

    conectado.query(`SELECT * FROM materias where Nombre_materia = "${materia}"`, async (error, results)=>{
        console.log(results)
        if(results.length == 0){
            conectado.query('INSERT INTO materias SET ?',{nombre_materia:materia}, async(error,result)=>{
                if(error){
                    console.log(error)
                    res.redirect('/')
                }
            })
        }
        

        conectado.query(`INSERT INTO notas (ID_Materias, ID_Usuarios, Numero, Nota) SELECT (SELECT ID FROM materias where Nombre_materia = "${materia}") as id, "${id}", 0, null`,{nombre_materia:materia}, async(error,result)=>{
            if(error){
                console.log(error)
                res.redirect('/')
            }
        })

        res.redirect('/')
        
    })
})


module.exports = router;