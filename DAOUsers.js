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
            [email,password],
            function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    let email = rows[0].email;
                    let nick = rows[0].nick;
                    let reputacion = rows[0].reputacion;
                    let fechaAlta = rows[0].fechaAlta;
                    let img = rows[0].imagen;
                    let userInfo = {email, nick, reputacion, fechaAlta, img};
                    callback(userInfo);         
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
                            let users = rows.slice();
                            users.map(userInfo => {userInfo.nick, userInfo.reputacion, userInfo.imagen, userInfo.nombretiqueta});
                            callback(users);
                        }
                    }
                );
            }
        });
    }

    registerUser(email, password, nick, imagen, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO usuario(usuario.email, usuario.nick, usuario.contraseña, usuario.imagen) VALUES (?,?,SHA1(?),?)",
                    [email, nick, password, imagen],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(true);
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
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    let bronce = {num:0,lista:[]};
                    let plata = {num:0,lista:[]};
                    let oro = {num:0,lista:[]};;
                    rows.array.forEach(element => {
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
                    
                    callback(medallas);         
                }
            });
            }
        }
        );
    }
  

  }
  module.exports = DAOUsers;
  