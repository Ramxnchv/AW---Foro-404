const express = require("express");
const path = require("path");
const multer = require("multer");
const multerFactory = multer({storage:multer.memoryStorage()});

const moldelUsuarios = require("../models/modelUsuarios");



const config = require("../config");
const mysql = require("mysql");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database });
const middlewareSession = session({
    saveUninitialized: false,
    secret: "404",
    resave: false,
    store: sessionStore
});

const pool = mysql.createPool(config.mysqlConfig);
const mUsuarios = new moldelUsuarios(pool);

class controllerUsuarios{

    getLogin(request,response,next){
        response.render("login", { errorMsg: null });
    }

    postLogin(request,response,next){
        mUsuarios.isUserCorrect(request.body.correo,
            request.body.password, function (error, ok) {
                if (error) { // error de acceso a la base de datos
                    response.status(500);
                    response.render("login", { errorMsg: "Error interno de acceso a la base de datos" });
                }
                else if (ok) {
                    request.session.currentUser = request.body.correo;
                    response.redirect("../index");
                } 
                else {
                    response.status(200);
                    response.render("login", { errorMsg: "Dirección de correo y/o contraseña no válidos" });
                }
            }
        )
    }

    getRegister(request,response,next){
        response.render("register");
    }

    postRegister(request,response,next){
        mUsuarios.registerUser(
            request.body.correo,
            request.body.password,
            request.body.nick,
            request.file.filename,
            function(err, result){
                if (err) {
                    console.log(err.message);
                    response.redirect("login");
                } else {
                    response.redirect("login");
                }
            }
        )
    }

    
}

module.exports = controllerUsuarios;