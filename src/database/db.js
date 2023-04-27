const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost', //process.env.DB_HOST
    user: 'root',//process.env.DB_USER
    password: '2045',//process.env.DB_PASSWORD
    database: 'proyNotas'//process.env.DB_DATABASE
});


connection.connect((error)=>{
    if(error){
        console.log('el error de conexión es :'+error);
        return;
    }
    console.log('conectado a la base de datos');
});

module.exports = connection;
