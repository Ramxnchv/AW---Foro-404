"use strict"

const mysql = require("mysql");
const config = require("./config");

const DAOUsers = require("./DAOUsers");
const DAOQuestions = require("./DAOQuestions");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});


let daoUser = new DAOUsers(pool);
let daoQuestion = new DAOQuestions(pool);

// Uso de los métodos de las clases DAOUsers y DAOQuestions
//daoUser.isUserCorrect("ramonros@ucm.es","blablabla", cb_isUserCorrect);
//daoUser.getUserInfo("ramonros@ucm.es", cb_getUserInfo);
//daoUser.getMedallas("ramonros@ucm.es", cb_getMedallas);
//daoUser.getAllUsers(cb_getAllUsers);
//daoUser.registerUser("ramonros@ucm.es","59061MID","Ramxnchv","/public/resources/userImages/magdalena.jpg",cb_registerUser);
//daoQuestion.getAllQuestions(cb_getAllQuestions);
//daoQuestion.getQuestionsByTag("JS",cb_getQuestionsByTag);
//daoQuestion.getQuestionsByText("bla",cb_getQuestionsByText);
//daoQuestion.getNoAnsweredQuestions(cb_getNoAnsweredQuestions);
//daoQuestion.getQuestionInfo(8,cb_getQuestionInfo);

daoQuestion.insertQuestion("pruebas@ucm.es","Laravel vs Express","Cual de los dos frameworks es mejor para desarrollar el backend de una aplicacion web",["Laravel" , "Express"],cb_insertQuestion);

//daoQuestion.getAnswersByQuestion(8,cb_getAnswersByQuestion);
//daoQuestion.insertAnswer("ramonros@ucm.es","Personalmente me gusta mas Express ya que puedes desarrollar tanto backend como front utilizando solo javascript",9,cb_InsertAnswer);


// Definición de las funciones callback

function cb_isUserCorrect(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        if(result){
            console.log("Usuario y contraseña correctos");
        }
        else{
            console.log("Usuario o contraseña incorrectos");
        }
    }
}

function cb_getUserInfo(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_getMedallas(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_getAnswersByQuestion(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_getAllUsers(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_registerUser(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log("Usuario registrado correctamente");
    }
}


function cb_insertQuestion(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log("Pregunta insertada correctamente");
    }
}

function cb_InsertAnswer(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log("Respuesta insertada correctamente");
    }
}

function cb_getQuestionInfo(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_getAllQuestions(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_getNoAnsweredQuestions(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_getQuestionsByTag(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}

function cb_getQuestionsByText(err, result){
    if (err) {
        console.log(err.message);
    
    } else {
        console.log(result);
    }
}