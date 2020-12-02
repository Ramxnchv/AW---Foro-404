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
let daoQuestion = new DAOQuestion(pool);


// Uso de los métodos de las clases DAOUsers y DAOQuestions

// Definición de las funciones callback