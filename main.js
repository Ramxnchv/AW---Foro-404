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


// let daoUser = new DAOUsers(pool);
let daoQuestion = new DAOQuestions(pool);

// Uso de los métodos de las clases DAOUsers y DAOQuestions
// daoQuestion.getAllQuestions(cb_getAllQuestions);
daoQuestion.getQuestionsByTag("PHP",cb_getQuestionsByTag);
//daoQuestion.getQuestionsByText("de",cb_getQuestionsByText);
// Definición de las funciones callback

function cb_getAllQuestions(err, result){
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