const express = require("express");
const path = require("path");


const modelPreguntas = require("../models/modelPreguntas");


const config = require("../config");
const mysql = require("mysql");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");


const pool = mysql.createPool(config.mysqlConfig);
const mPreguntas = new modelPreguntas(pool);

class controllerPreguntas{

    getPreguntas(request,response,next){
        mPreguntas.getAllQuestions(function(err,preguntasLista){
            if(err){
                console.log(err.message);
            }
            else{
                response.render("preguntas", { preguntas: preguntasLista});
            }
        });
    }

    getFormularPregunta(request,response,next){
       
    }

    postFormularPregunta(request,response,next){
        
    }

    getPreguntasPorEtiqueta(request,response,next){
        
    }

    getPreguntasSinResponder(request,response,next){
        
    }

    getPreguntasPorTexto(request,response,next){
        
    }

    getPregunta(request,response,next){
        
    }

}

module.exports = controllerPreguntas;