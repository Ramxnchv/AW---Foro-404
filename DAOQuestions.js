"use strict"

class DAOQuestions {

    constructor(pool) {
        this.pool = pool;
      }
  
  

  getQuestionInfo(){

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
              callback(new Error("Error de acceso a la base de datos"));
            }
            else {
              etiquetas.array.forEach(t => {
                //Comprobamos si existe la etiqueta previamente
                connection.query("SELECT COUNT(*) FROM etiqueta WHERE etiqueta.nombre = ?",
                  [t],
                  function (err, count) {
                    if (err) {
                      callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                      if (count[0] == 0) { //Si no existia la añadimos
                        connection.query("INSERT INTO etiqueta (etiqueta.nombre) VALUES ?",
                          [t],
                          function (err, r) {
                            if (err) {
                              callback(new Error("Error de acceso a la base de datos"));
                            }
                          })
                      }
                      //Conectamos la etiqueta con la pregunta
                      connection.query("INSERT INTO etiquetapregunta(etiquetapregunta.nombreEtiqueta, etiquetapregunta.idPregunta) VALUES (?,?)",
                        [t, idPregunta],
                        function (err, r) {
                          if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                          }
                          else {
                            connection.release(); // devolver al pool la conexión
                            callback(true);
                          }
                        }
                      )
                    }
                  }
                )
              });
            }
          });
      }
    }
    );
  }

  getAllQuestions(callback){
    this.pool.getConnection(function(err, connection) {
      if (err) { 
          callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
      connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email",
      function(err, rows) {
          connection.release(); // devolver al pool la conexión
          if (err) {
            console.log(rows);
              callback(new Error("Error de acceso a la base de datos2"));
          }
          else {
           
            
            let questionsInfo = [];

            for(let i = 0; i < rows.length; ++i){
              let titulo = rows[i].titulo;
              let texto = rows[i].texto.substring(0,150);
              let fecha = rows[i].fecha;
              let etiquetas = [rows[i].nombreEtiqueta];
              let nick = rows[i].nick;
              let imagen = rows[i].imagen;
              let indice = i;
              while ( i+1 < rows.length && rows[indice].id == rows[i+1].id){
                etiquetas.push(rows[i+1].nombreEtiqueta);
                i++;
              }
              let questionInfo = {titulo, texto, etiquetas, fecha, nick, imagen};
              questionsInfo.push(questionInfo);
              
            }

              callback(null,questionsInfo);         
          }
      });
      }
  }
  );
  }

  getQuestionsByTag(tag, callback){
    this.pool.getConnection(function(err, connection) {
      if (err) { 
          callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
      connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email",
      function(err, rows) {
          connection.release(); // devolver al pool la conexión
          if (err) {
            console.log(rows);
              callback(new Error("Error de acceso a la base de datos2"));
          }
          else {
            let questionsInfo = [];

            for(let i = 0; i < rows.length; ++i){
              let titulo = rows[i].titulo;
              let texto = rows[i].texto.substring(0,150);
              let fecha = rows[i].fecha;
              let etiquetas = [rows[i].nombreEtiqueta];
              let nick = rows[i].nick;
              let imagen = rows[i].imagen;
              let indice = i;
              while ( i+1 < rows.length && rows[indice].id == rows[i+1].id){
                etiquetas.push(rows[i+1].nombreEtiqueta);
                i++;
              }
              let questionInfo = {titulo, texto, etiquetas, fecha, nick, imagen};
              questionsInfo.push(questionInfo);
              
            }

              callback(null,questionsInfo.filter(aux => aux.etiquetas.some(aux => aux === tag)));         
          }
      });
      }
  }
  );
  }


  getQuestionsByText(text,callback){
    var t = ["%",text,"%"].join('');
    this.pool.getConnection(function(err, connection) {
      if (err) { 
          callback(new Error("Error de conexión a la base de datos1"));
      }
      else {
      connection.query("SELECT pregunta.id, pregunta.titulo, pregunta.texto, pregunta.fecha, etiquetapregunta.nombreEtiqueta, usuario.nick, usuario.imagen FROM pregunta JOIN etiquetapregunta ON pregunta.id = etiquetapregunta.idPregunta JOIN usuario ON pregunta.emailCreador = usuario.email WHERE pregunta.titulo LIKE ? OR pregunta.texto LIKE ?",
      [t,t],
      function(err, rows) {
          connection.release(); // devolver al pool la conexión
          if (err) {
              callback(new Error("Error de acceso a la base de datos2"));
          }
          else {
           
            
            let questionsInfo = [];

            for(let i = 0; i < rows.length; ++i){
              let titulo = rows[i].titulo;
              let texto = rows[i].texto.substring(0,150);
              let fecha = rows[i].fecha;
              let etiquetas = [rows[i].nombreEtiqueta];
              let nick = rows[i].nick;
              let imagen = rows[i].imagen;
              let indice = i;
              while ( i+1 < rows.length && rows[indice].id == rows[i+1].id){
                etiquetas.push(rows[i+1].nombreEtiqueta);
                i++;
              }
              let questionInfo = {titulo, texto, etiquetas, fecha, nick, imagen};
              questionsInfo.push(questionInfo);
              
            }

              callback(null,questionsInfo);         
          }
      });
      }
  }
  );
  }

  getAnswersByQuestion(idPregunta, callback){
    this.pool.getConnection(function(err, connection) {
      if (err) { 
          callback(new Error("Error de conexión a la base de datos"));
      }
      else {
      connection.query("SELECT respuesta.texto, respuesta.puntos, respuesta.fecha, usuario.nick, usuario.imagen FROM pregunta JOIN respuesta ON pregunta.id = respuesta.idPregunta JOIN usuario ON respuesta.emailCreador = usuario.email WHERE respuesta.idPregunta = ?",
      [idPregunta],
      function(err, rows) {
          connection.release(); // devolver al pool la conexión
          if (err) {
              callback(new Error("Error de acceso a la base de datos"));
          }
          else {
            let answersInfo = [];
            rows.forEach(row => {
              let texto = row.texto;
              let puntos = row.puntos;
              let fecha = row.fecha;
              let nick = row.nick;
              let imagen = row.imagen;

              let answerInfo = {texto, puntos, fecha, nick, imagen};
              questions.push(answerInfo);
            });
              callback(answersInfo);         
          }
      });
      }
  }
  );
  }

  insertAnswer(email, texto, idPregunta, callback){
    this.pool.getConnection(function(err, connection) {
      if (err) { 
          callback(new Error("Error de conexión a la base de datos"));
      }
      else {
        connection.query("INSERT INTO respuesta (respuesta.emailCreador,respuesta.texto, respuesta.idPregunta) VALUES (?,?,?) ",
        [email, texto, idPregunta],
        function(error, r){
          connection.release(); // devolver al pool la conexión
          if(err){
            callback(new Error("Error de acceso a la base de datos"));
          }
          else{
            callback(true);
          }
        });
      }
  });
}


}

  module.exports = DAOQuestions;