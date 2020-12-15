"use strict"

class DAOQuestions {

  constructor(pool) {
    this.pool = pool;
  }

  insertQuestion(email, titulo, cuerpo, etiquetas, callback) {
    var idPregunta = "";
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }
      else {
        // Insertamos la informacion de la pregunta
        connection.query("INSERT INTO pregunta(pregunta.emailCreador, pregunta.titulo, pregunta.texto) VALUES (?,?,?)",
          [email, titulo, cuerpo],
          function (err, result) {
            idPregunta = result.insertId;
            if (err) {
              callback(new Error("Error al insertar la pregunta en la base de datos"));
            }
            else {

              etiquetas.forEach(t => {
                //Comprobamos si existe la etiqueta previamente
                connection.query("SELECT COUNT(*) AS cuenta FROM etiqueta WHERE etiqueta.nombre = ?",
                  [t],
                  function (err, count) {
                    if (err) {
                      callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {

                      if (count[0].cuenta === 0) { //Si no existia la añadimos
                        connection.query("INSERT INTO etiqueta (etiqueta.nombre) VALUES (?)",
                          [t],
                          function (err, r) {
                            if (err) {
                              callback(new Error("Error al insertar una etiqueta en la base de datos"));
                            }
                          })
                      }
                      //Conectamos la etiqueta con la pregunta
                      connection.query("INSERT INTO etiquetapregunta(etiquetapregunta.nombreEtiqueta, etiquetapregunta.idPregunta) VALUES (?,?)",
                        [t, idPregunta],
                        function (err, r) {
                          if (err) {
                            callback(new Error("Error al relacionar una etiqueta con una pregunta en la base de datos"));
                          }
                        }
                      )
                      
                    }
                  }
                )
              });
              
            }
              connection.release();
              callback(null, true);
          });
      }
    }
    );
  }

  getAllQuestions(callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
        connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email",
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              console.log(rows);
              callback(new Error("Error de acceso a la base de datos2"));
            }
            else {


              let questionsInfo = [];

              for (let i = 0; i < rows.length; ++i) {
                let titulo = rows[i].titulo;
                let texto = rows[i].texto.substring(0, 150);
                let fechaBD = new Date(rows[i].fecha);
                let fecha = { dia: fechaBD.getDate(), mes: fechaBD.getMonth(), anyo: fechaBD.getFullYear() }
                let fechastr = `${fecha.dia}/${fecha.mes}/${fecha.anyo}`;
                let etiquetas = [rows[i].nombreEtiqueta];
                let nick = rows[i].nick;
                let imagen = rows[i].imagen;
                let indice = i;
                while (i + 1 < rows.length && rows[indice].id == rows[i + 1].id) {
                  etiquetas.push(rows[i + 1].nombreEtiqueta);
                  i++;
                }
                let questionInfo = { titulo, texto, etiquetas, fechastr, nick, imagen };
                questionsInfo.push(questionInfo);

              }

              callback(null, questionsInfo);
            }
          });
      }
    }
    );
  }

  getQuestionsByTag(tag, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
        connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email",
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              console.log(rows);
              callback(new Error("Error de acceso a la base de datos2"));
            }
            else {
              let questionsInfo = [];

              for (let i = 0; i < rows.length; ++i) {
                let titulo = rows[i].titulo;
                let texto = rows[i].texto.substring(0, 150);
                let fechaBD = new Date(rows[i].fecha);
                let fecha = { dia: fechaBD.getDate(), mes: fechaBD.getMonth(), anyo: fechaBD.getFullYear() }
                let fechastr = `${fecha.dia}/${fecha.mes}/${fecha.anyo}`;
                let etiquetas = [rows[i].nombreEtiqueta];
                let nick = rows[i].nick;
                let imagen = rows[i].imagen;
                let indice = i;
                while (i + 1 < rows.length && rows[indice].id == rows[i + 1].id) {
                  etiquetas.push(rows[i + 1].nombreEtiqueta);
                  i++;
                }
                let questionInfo = { titulo, texto, etiquetas, fechastr, nick, imagen };
                questionsInfo.push(questionInfo);

              }

              callback(null, questionsInfo.filter(aux => aux.etiquetas.some(aux => aux === tag)));
            }
          });
      }
    }
    );
  }


  getQuestionsByText(text, callback) {
    let t = ["%", text, "%"].join('');
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
        connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email WHERE pregunta.titulo LIKE ? OR pregunta.texto LIKE ?",
          [t, t],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos2"));
            }
            else {


              let questionsInfo = [];

              for (let i = 0; i < rows.length; ++i) {
                let titulo = rows[i].titulo;
                let texto = rows[i].texto.substring(0, 150);
                let fechaBD = new Date(rows[i].fecha);
                let fecha = { dia: fechaBD.getDate(), mes: fechaBD.getMonth(), anyo: fechaBD.getFullYear() }
                let fechastr = `${fecha.dia}/${fecha.mes}/${fecha.anyo}`;
                let etiquetas = [rows[i].nombreEtiqueta];
                let nick = rows[i].nick;
                let imagen = rows[i].imagen;
                let indice = i;
                while (i + 1 < rows.length && rows[indice].id == rows[i + 1].id) {
                  etiquetas.push(rows[i + 1].nombreEtiqueta);
                  i++;
                }
                let questionInfo = { titulo, texto, etiquetas, fechastr, nick, imagen };
                questionsInfo.push(questionInfo);

              }

              callback(null, questionsInfo);
            }
          });
      }
    }
    );
  }

  getAnswersByQuestion(idPregunta, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }
      else {
        connection.query("SELECT respuesta.texto, respuesta.puntos, respuesta.fecha, usuario.nick, usuario.imagen FROM pregunta JOIN respuesta ON pregunta.id = respuesta.idPregunta JOIN usuario ON respuesta.emailCreador = usuario.email WHERE respuesta.idPregunta = ?",
          [idPregunta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            }
            else {
              let answersInfo = [];
              rows.forEach(row => {
                let texto = row.texto;
                let puntos = row.puntos;
                let fechaBD = new Date(row.fecha);
                let fecha = { dia: fechaBD.getDate(), mes: fechaBD.getMonth(), anyo: fechaBD.getFullYear() }
                let fechastr = `${fecha.dia}/${fecha.mes}/${fecha.anyo}`;
                let nick = row.nick;
                let imagen = row.imagen;

                let answerInfo = { texto, puntos, fechastr, nick, imagen };
                answersInfo.push(answerInfo);
              });
              callback(null, answersInfo);
            }
          });
      }
    }
    );
  }

  getQuestionInfo(idPregunta, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
        connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, pregunta.numVisitas, pregunta.puntos, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email WHERE pregunta.id = ?",
          [idPregunta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              console.log(rows);
              callback(new Error("Error de acceso a la base de datos2"));
            }
            else {
              let questionInfo = {};
              for (let i = 0; i < rows.length; ++i) {
                let titulo = rows[i].titulo;
                let texto = rows[i].texto.substring(0, 150);
                let fechaBD = new Date(rows[i].fecha);
                let fecha = { dia: fechaBD.getDate(), mes: fechaBD.getMonth(), anyo: fechaBD.getFullYear() }
                let fechastr = `${fecha.dia}/${fecha.mes}/${fecha.anyo}`;
                let etiquetas = [rows[i].nombreEtiqueta];
                let visitas = rows[i].numVisitas;
                let puntos = rows[i].puntos;
                let nick = rows[i].nick;
                let imagen = rows[i].imagen;
                let indice = i;
                while (i + 1 < rows.length && rows[indice].id == rows[i + 1].id) {
                  etiquetas.push(rows[i + 1].nombreEtiqueta);
                  i++;
                }
                questionInfo = { titulo, texto, etiquetas, visitas, puntos, fechastr, nick, imagen };

              }

              callback(null, questionInfo);
            }
          });
      }
    }
    );
  }

  insertAnswer(email, texto, idPregunta, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }
      else {
        connection.query("INSERT INTO respuesta (respuesta.emailCreador,respuesta.texto, respuesta.idPregunta) VALUES (?,?,?) ",
          [email, texto, idPregunta],
          function (error, r) {
            idRespuesta = result.insertId;
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            }
            else{
              callback(null, true);
            }
          });
      }
    });
  }

  getNoAnsweredQuestions(callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
        connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email LEFT JOIN respuesta ON pregunta.id = respuesta.idPregunta WHERE respuesta.id IS NULL",
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              console.log(rows);
              callback(new Error("Error de acceso a la base de datos2"));
            }
            else {


              let questionsInfo = [];

              for (let i = 0; i < rows.length; ++i) {
                let titulo = rows[i].titulo;
                let texto = rows[i].texto.substring(0, 150);
                let fechaBD = new Date(rows[i].fecha);
                let fecha = { dia: fechaBD.getDate(), mes: fechaBD.getMonth(), anyo: fechaBD.getFullYear() }
                let fechastr = `${fecha.dia}/${fecha.mes}/${fecha.anyo}`;
                let etiquetas = [rows[i].nombreEtiqueta];
                let nick = rows[i].nick;
                let imagen = rows[i].imagen;
                let indice = i;
                while (i + 1 < rows.length && rows[indice].id == rows[i + 1].id) {
                  etiquetas.push(rows[i + 1].nombreEtiqueta);
                  i++;
                }
                let questionInfo = { titulo, texto, etiquetas, fechastr, nick, imagen };
                questionsInfo.push(questionInfo);

              }

              callback(null, questionsInfo);
            }
          });
      }
    }
    );
  }

  updateVisitas(idPregunta, callback){
    //actualiza visitas de la pregunta id (en una mas)
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }
      else {
        connection.query("UPDATE pregunta SET pregunta.numVisitas = pregunta.numVisitas+1 WHERE pregunta.id = ?  ",
          [idPregunta],
          function (error) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            }
            else {
              callback(null, true);
            }
          });
      }
    });
  }

  insertarVotoPregunta(idPregunta, emailUsuario, voto, callback){
    //inserta un voto en votopregunta -> la actualización de puntos en la tabla pregunta ya se hace en el trigger (no hay que hacerla aqui)
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }
      else {
        connection.query("SELECT COUNT(*) AS cuenta, voto FROM votopregunta WHERE idpregunta = ? AND emailusuario = ?",
          [idPregunta, emailUsuario],
          function (error, count) {
            
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            }
            else {

              if(count[0].cuenta == 0){ //Si no ha votado ese usuario a esa pregunta hacemos un insert
                
                connection.query("INSERT INTO votopregunta (idPregunta, emailusuario,voto) VALUES (?, ?, ?) ",
                [idPregunta, emailUsuario,voto],
                function (error) {
                  if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                  }
                });
              }
              else{ //Si tenemos ya ha votado, hacemos un update
                if(count[0].voto != voto){
                connection.query("UPDATE votopregunta SET voto = ? WHERE idPregunta =  ? AND emailusuario = ?",
                [voto, idPregunta, emailUsuario],
                function (error) {
                  if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                  }
                });
              }
            }
              connection.release(); // devolver al pool la conexión
              callback(null, true);
            }
          });
      }
    });

    
  }

  insertarVotoRespuesta(idRespuesta, emailUsuario, voto, callback){
    //inserta un voto en votorespuesta -> la actualización de puntos en la tabla respuesta ya se hace en el trigger (no hay que hacerla aqui)
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }
      else {
        connection.query("SELECT COUNT(*) AS cuenta, voto FROM votorespuesta WHERE idrespuesta = ? AND emailusuario = ?",
          [idRespuesta, emailUsuario],
          function (error, count) {
            
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            }
            else {

              if(count[0].cuenta == 0){ //Si no ha votado ese usuario a esa pregunta hacemos un insert
                
                connection.query("INSERT INTO votorespuesta (idrespuesta, emailusuario,voto) VALUES (?, ?, ?) ",
                [idRespuesta, emailUsuario,voto],
                function (error) {
                  if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                  }
                });
              }
              else{ //Si tenemos ya ha votado, hacemos un update
                if(count[0].voto != voto){
                connection.query("UPDATE votorespuesta SET voto = ? WHERE idrespuesta =  ? AND emailusuario = ?",
                [voto, idRespuesta, emailUsuario],
                function (error) {
                  if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                  }
                });
              }
            }
              connection.release(); // devolver al pool la conexión
              callback(null, true);
            }
          });
      }
    });
  }

}

module.exports = DAOQuestions;