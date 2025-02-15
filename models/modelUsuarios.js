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
                      callback(null, null); //no está el usuario con el password proporcionado
                  }
                  else {
                      let infoNick = rows[0].nick;
                      let infoImg = rows[0].imagen;
                      let infoID = rows[0].ID;
                      let info = {infoNick,infoImg, infoID};
                      callback(null, info);
                  }           
              }
          });
          }
      }
      );
    }
    
    getUserInfo(id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
            connection.query("SELECT *,(SELECT COUNT(*) FROM pregunta JOIN usuario on pregunta.emailCreador = usuario.email WHERE usuario.email = (SELECT usuario.email FROM usuario WHERE usuario.ID = ?) ) AS numPreguntas ,(SELECT COUNT(*) FROM respuesta JOIN usuario on respuesta.emailCreador = usuario.email WHERE usuario.email = (SELECT usuario.email FROM usuario WHERE usuario.ID = ?) ) AS numRespuestas FROM usuario WHERE usuario.email = (SELECT usuario.email FROM usuario WHERE usuario.ID = ?) ",
            [id, id, id],
            function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de conexión a la base de datos"));
                }
                else {
                    let email = rows[0].email;
                    let nick = rows[0].nick;
                    let reputacion = rows[0].reputacion;
                    let fechaBD = new Date(rows[0].fechaAlta);
                    let fechaAlta = {dia:fechaBD.getDate(),mes:fechaBD.getMonth(),anyo:fechaBD.getFullYear()}
                    let fechastr = `${fechaAlta.dia}/${fechaAlta.mes}/${fechaAlta.anyo}`;
                    let img = rows[0].imagen;
                    let id = rows[0].ID;
                    let numPreguntas = rows[0].numPreguntas;
                    let numRespuestas = rows[0].numRespuestas;
                    let userInfo = {email, nick, reputacion, fechastr, img, id , numPreguntas, numRespuestas};
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
                connection.query("SELECT usuario.nick,usuario.reputacion,usuario.imagen,usuario.ID,nombretiqueta FROM (SELECT etiqueta.nombre AS nombretiqueta, COUNT(etiqueta.nombre) AS contadoretiqueta, usuario.* FROM etiqueta JOIN etiquetapregunta ON etiquetapregunta.nombreEtiqueta = etiqueta.nombre JOIN pregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email GROUP BY nombretiqueta ORDER BY contadoretiqueta DESC) AS contadores RIGHT JOIN usuario ON contadores.email = usuario.email GROUP BY usuario.email ORDER BY usuario.nick",
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
                                let id = userInfo.ID;
                                let nombretiqueta = userInfo.nombretiqueta;
                                users.push({nick, reputacion, imagen,id , nombretiqueta});
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

    getMedallas(id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
            connection.query("SELECT metal,nombre, COUNT(nombre) AS cantidad FROM medalla WHERE emailUsuario = (SELECT usuario.email FROM usuario WHERE usuario.ID = ?) GROUP BY nombre",
            [id],
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

    getUsersByText(text,callback){
        let t = ["%", text, "%"].join('');
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
        connection.query("SELECT usuario.nick,usuario.reputacion,usuario.imagen, usuario.ID, nombretiqueta FROM (SELECT etiqueta.nombre AS nombretiqueta, COUNT(etiqueta.nombre) AS contadoretiqueta, usuario.* FROM etiqueta JOIN etiquetapregunta ON etiquetapregunta.nombreEtiqueta = etiqueta.nombre JOIN pregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email GROUP BY nombretiqueta ORDER BY contadoretiqueta DESC) AS contadores RIGHT JOIN usuario ON contadores.email = usuario.email GROUP BY usuario.email HAVING usuario.nick LIKE ? ORDER BY usuario.nick",
                    [t],
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
                                let id = userInfo.ID;
                                let nombretiqueta = userInfo.nombretiqueta;
                                users.push({nick, reputacion, imagen, id, nombretiqueta});
                            }

                            callback(null,users);

                        }
                    }
                );
      }
    }
    );
    }
  
  }
  module.exports = DAOUsers;
  