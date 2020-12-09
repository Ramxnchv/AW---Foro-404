"use strict"

class DAOQuestions {

    constructor(pool) {
        this.pool = pool;
      }
  
  

  getQuestionInfo(){

  }

  insertQuestion(email, titulo, cuerpo, etiquetas){
    var idPregunta = "";
    this.pool.getConnection(function(err, connection) {
      if (err) { 
          callback(new Error("Error de conexión a la base de datos"));
      }
      else {
      // Insertamos la informacion de la pregunta
      connection.query("INSERT INTO pregunta(pregunta.emailCreador, pregunta.titulo, pregunta.texto) VALUES (?,?,?)",
      [email,titulo,cuerpo],
      function(err, result) {
        idPregunta = result.insertId;
          if (err) {
              callback(new Error("Error de acceso a la base de datos"));
          }
          else {
            etiquetas.array.forEach(t => {
              //Comprobamos si existe la etiqueta previamente
              connection.query("SELECT COUNT(*) FROM etiqueta WHERE etiqueta.nombre = ?",
              [t],
              function(err, count){
                if (err) {
                  callback(new Error("Error de acceso a la base de datos"));
              }
                else{
                if(count[0] == 0){ //Si no existia la añadimos
                  connection.query("INSERT INTO etiqueta (etiqueta.nombre) VALUES ?",
                  [t],
                  function(err,r){
                    if (err) {
                      callback(new Error("Error de acceso a la base de datos"));
                    }
                  })
                }
                //Conectamos la etiqueta con la pregunta
                connection.query("INSERT INTO etiquetapregunta(etiquetapregunta.nombreEtiqueta, etiquetapregunta.idPregunta) VALUES (?,?)",
                      [t,idPregunta],
                       function(err, r){
                        if (err) {
                          callback(new Error("Error de acceso a la base de datos"));
                        }
                        else{
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

  getAllQuestions(){

  }

  getQuestionsByTag(){

  }

  getQuestionsByText(){
      
  }

  getAnswersByQuestion(){

  }

  insertAnswer(email, texto, idPregunta){
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