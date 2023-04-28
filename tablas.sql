--IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'proyNotas')
--  BEGIN
    CREATE DATABASE proyNotas;
    
    USE proyNotas;

    create table usuarios (
        ID int not null primary key auto_increment,
        Nombre varchar(45) not null,
        Apellido varchar(45) not null,
        us_nickname varchar(45) not null,
        us_correo varchar(54) not null,
        password Varchar(45) not null
    );

    create table materias(
        ID int not null primary key auto_increment,
        nombre_materia varchar(45) not null
    );

    create table notas(
        id_materias int not null,
        id_usuarios int not null,
        ID int not null auto_increment,
        numero int not null,
        nota float,
        PRIMARY KEY (ID, id_materias, id_usuarios),
        FOREIGN KEY (id_materias) REFERENCES materias(ID),
        FOREIGN KEY (id_usuarios) REFERENCES usuarios(ID)
    );
--  END
