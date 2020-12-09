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
    
    getUserInfo(email, password, callback) {
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
                    let email = rows[0].email;
                    let nick = rows[0].nick;
                    let reputacion = rows[0].reputacion;
                    let fechaAlta = rows[0].fechaAlta;
                    let img = rows[0].img;
                    let userInfo = {email, nick, reputacion, fechaAlta, img};
                    callback(userInfo);         
                }
            });
            }
        }
        );
    }

    getAllUsers(email, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
            connection.query("SELECT usuario.nick,usuario.reputacion, nombretiqueta, MAX(contadoretiqueta) AS etiquetamayor FROM usuario, (SELECT etiqueta.nombre AS nombretiqueta, COUNT(etiqueta.nombre) AS contadoretiqueta FROM etiqueta JOIN etiquetapregunta ON etiquetapregunta.nombreEtiqueta = etiqueta.nombreJOIN pregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON usuario.email = pregunta.emailCreador GROUP BY nombretiqueta ORDER BY contadoretiqueta DESC) AS contadores;")
            ,function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    let email = rows[0].email;
                    let nick = rows[0].nick;
                    let reputacion = rows[0].reputacion;
                    let fechaAlta = rows[0].fechaAlta;
                    let img = rows[0].img;
                    let userInfo = {email, nick, reputacion, fechaAlta, img};
                    callback(userInfo);         
                }
            });
            }
        }
        );
    }

    registerUser(email, password, nick, imagen, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
            connection.query("INSERT INTO usuario(usuario.email, usuario.nick, usuario.contraseña, usuario.imagen) VALUES (?,?,SHA1(?),?)",
            [email,nick,password,imagen],
            function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                   
                    callback(true);          
                }
            });
            }
        }
        );
    }

    //FALTA HACER ESTE
    getMedallas(email, password, callback) {
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
                    let email = rows[0].email;
                    let nick = rows[0].nick;
                    let reputacion = rows[0].reputacion;
                    let fechaAlta = rows[0].fechaAlta;
                    let img = rows[0].img;
                    let userInfo = {email, nick, reputacion, fechaAlta, img};
                    callback(userInfo);         
                }
            });
            }
        }
        );
    }
  

  }
  module.exports = DAOUsers;
  