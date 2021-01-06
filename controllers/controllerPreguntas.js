const express = require("express");
const path = require("path");


const modelPreguntas = require("../models/modelPreguntas");


const config = require("../config");
const mysql = require("mysql");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const bodyParser = require("body-parser");
const utils = require("../utils");

let utilidades = new utils();

const pool = mysql.createPool(config.mysqlConfig);
const mPreguntas = new modelPreguntas(pool);

class controllerPreguntas{

    getPreguntas(request,response,next){
        mPreguntas.getAllQuestions(function(err,preguntasLista){
            if(err){
                console.log(err.message);
            }
            else{
                preguntasLista.forEach(function(pregunta){
                    console.log(pregunta.etiquetas);
                })
                response.render("preguntas", { preguntas: preguntasLista});
            }
        });
    }

    getFormularPregunta(request,response,next){
       response.render("formularpregunta",{error:null});
    }

    postFormularPregunta(request,response,next){
        let etiq = utilidades.parseTags(request.body.etiquetaspregunta);
        if(etiq.tags === null){
            response.render("formularpregunta.ejs",{error: "Error: el máximo de etiquetas son 5"});
        }
        else{
            mPreguntas.insertQuestion(request.session.currentUser,request.body.titulopregunta,request.body.cuerpopregunta,etiq.tags,function(err, result){
                if (err) {
                    console.log(err.message);
                }
            });
            response.redirect("/preguntas");
        } 
    }

    getPreguntasPorEtiqueta(request,response,next){
        mPreguntas.getQuestionsByTag(request.params.idEtiqueta,function(err,preguntasLista){
            if(err){
                console.log(err.message);
            }
            else{
                response.render("preguntasporetiqueta", { preguntas: preguntasLista, etiqueta: request.params.idEtiqueta});
            }
        });
    }

    getPreguntasSinResponder(request,response,next){
        mPreguntas.getNoAnsweredQuestions(function(err,preguntasLista){
            if(err){
                console.log(err.message);
            }
            else{
                response.render("preguntassinresponder", { preguntas: preguntasLista});
            }
        });
    }

    getPreguntasPorTexto(request,response,next){
        mPreguntas.getQuestionsByText(request.query.busqueda,function(err,preguntasLista){
            if(err){
                console.log(err.message);
            }
            else{
                response.render("preguntasportitulotexto", { preguntas: preguntasLista, busqueda: request.query.busqueda});
            }
        });
    }

    getPregunta(request,response,next){
        mPreguntas.getQuestionInfo(request.params.idPregunta,function(err,questionInfo){
            if(err){
                console.log(err.message);
            }
            else{
                mPreguntas.getAnswersByQuestion(request.params.idPregunta, function(err, answers){
                    if(err){
                        console.log(err.message);
                    }
                    else{
                        mPreguntas.updateVisitas(request.params.idPregunta, function(err, result){
                            if(err){
                                console.log(err.message);
                            }
                            else{
                                response.render("pregunta", { pregunta: questionInfo, respuestas: answers});
                            }
                        }); 
                    }
                });
            }
        });
    }

    postRespuesta(request,response,next){
        mPreguntas.insertAnswer(request.session.currentUser,request.body.cuerporespuesta,request.params.idPregunta,function(err){
            if (err) {
                console.log(err.message);
            
            } else {
                response.redirect(`/preguntas/${request.params.idPregunta}`);
            }
        });
    }

    postVotoPositivo(request,response,next){
        mPreguntas.insertarVotoPregunta(request.params.idPregunta,request.session.currentUser,1,function(err, result){
            if (err) {
                console.log(err.message);
            
            } else {
                response.redirect(`/preguntas/${request.params.idPregunta}`);
            }
        });
    }

    postVotoNegativo(request,response,next){
        mPreguntas.insertarVotoPregunta(request.params.idPregunta,request.session.currentUser,-1,function(err, result){
            if (err) {
                console.log(err.message);
            
            } else {
                response.redirect(`/preguntas/${request.params.idPregunta}`);
            }
        });
    }

    postVotoRespuestaPositivo(request,response,next){
        mPreguntas.insertarVotoRespuesta(request.params.idRespuesta,request.session.currentUser,1,function(err, result){
            if (err) {
                console.log(err.message);
            
            } else {
                response.redirect(`/preguntas/${request.params.idPregunta}`);
            }
        });
    }

    postVotoRespuestaNegativo(request,response,next){
        mPreguntas.insertarVotoRespuesta(request.params.idRespuesta,request.session.currentUser,-1,function(err, result){
            if (err) {
                console.log(err.message);
            
            } else {
                response.redirect(`/preguntas/${request.params.idPregunta}`);
            }
        });
    }

}

module.exports = controllerPreguntas;