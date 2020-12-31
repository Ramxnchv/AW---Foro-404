"use strict"

class DAOUsers {

    constructor(pool) {
        this.pool = pool;
      }
  
    isUserCorrect(email, password, callback) {
      this.pool.getConnection(function(err, connection) {
          if (err) { 
              callback(new Error("Error de conexión a la base de datos"));
          }
          else {
          connection.query("SELECT * FROM usuario WHERE email = ? AND contraseña = SHA1(?);",
          [email,password],
          function(err, rows) {
              connection.release(); // devolver al pool la conexión
              if (err) {
                  callback(new Error("Error de acceso a la base de datos"));
              }
              else {
                  if (rows.length === 0) {
                      callback(null, false); //no está el usuario con el password proporcionado
                  }
                  else {
                      callback(null, true);
                  }           
              }
          });
          }
      }
      );
    }
    
    getUserInfo(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
            connection.query("SELECT * FROM usuario WHERE email = ?",
            [email],
            function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    let email = rows[0].email;
                    let nick = rows[0].nick;
                    let reputacion = rows[0].reputacion;
                    let fechaBD = new Date(rows[i].fecha);
                    let fechaAlta = {dia:fechaBD.getDate(),mes:fechaBD.getMonth(),anyo:fechaBD.getFullYear()}
                    let fechastr = `${fechaAlta.dia}/${fechaAlta.mes}/${fechaAlta.anyo}`;
                    let img = rows[0].imagen;
                    let userInfo = {email, nick, reputacion, fechastr, img};
                    callback(null,userInfo);         
                }
            });
            }
        }
        );
    }

    getAllUsers(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT usuario.nick,usuario.reputacion,usuario.imagen,nombretiqueta FROM (SELECT etiqueta.nombre AS nombretiqueta, COUNT(etiqueta.nombre) AS contadoretiqueta, usuario.* FROM etiqueta JOIN etiquetapregunta ON etiquetapregunta.nombreEtiqueta = etiqueta.nombre JOIN pregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email GROUP BY nombretiqueta ORDER BY contadoretiqueta DESC) AS contadores RIGHT JOIN usuario ON contadores.email = usuario.email GROUP BY usuario.email ORDER BY usuario.nick",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            let users = [];
                            for (let userInfo of rows){
                                let nick = userInfo.nick;
                                let reputacion = userInfo.reputacion;
                                let imagen = userInfo.imagen;
                                let nombretiqueta = userInfo.nombretiqueta;
                                users.push({nick, reputacion, imagen, nombretiqueta});
                            }

                            callback(null,users);

                        }
                    }
                );
            }
        });
    }

    registerUser(email, password, nick, imagen, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"),false);
            }
            else {
                connection.query("INSERT INTO usuario(usuario.email, usuario.nick, usuario.contraseña, usuario.imagen) VALUES (?,?,SHA1(?),?)",
                    [email, nick, password, imagen],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Este email ya tiene un usuario asociado"),false);
                        }
                        else {
                            callback(null,true);
                        }
                    }
                );
            }
        });
    }

    getMedallas(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
            connection.query("SELECT metal,nombre, COUNT(nombre) AS cantidad FROM medalla WHERE emailUsuario = ? GROUP BY nombre",
            [email],
            function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Usuario inexistente con ese email"));
                }
                else {
                    let bronce = {num:0,lista:[]};
                    let plata = {num:0,lista:[]};
                    let oro = {num:0,lista:[]};;
                    rows.forEach(element => {
                        let nombre = element.nombre;
                        let cantidad = element.cantidad;

                        if(element.metal === "bronce"){
                            bronce.lista.push({nombre, cantidad});
                            bronce.num += cantidad;
                        }
                        else if(element.metal === "plata"){
                            plata.lista.push({nombre, cantidad});
                            plata.num += cantidad;
                        }
                        else{
                            oro.lista.push({nombre, cantidad});
                            oro.num += cantidad;
                        }
                    });
                    
                    let medallas = {bronce,plata,oro};
                    
                    callback(null,medallas);         
                }
            });
            }
        }
        );
    }

    getUserImage(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT imagen FROM usuario WHERE email = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(new Error("El usuario no existe")); //no tiene imagen de usuario
                            }
                            else {
                                //console.log(rows[0].imagen);
                                callback(null, rows[0].imagen);
                            }
                        }
                    });
            }
        }
        );
    }
  
  }
  module.exports = DAOUsers;
  