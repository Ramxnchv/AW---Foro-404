const express = require("express");
const path = require("path");


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
            request.body.password, function (error, info) {
                if (error) { // error de acceso a la base de datos
                    response.status(500);
                    response.render("login", { errorMsg: "Error interno de acceso a la base de datos" });
                }
                else if (info != null) {
                    request.session.currentUser = request.body.correo;
                    request.session.currentUserNick = info.infoNick;
                    request.session.currentUserImg = info.infoImg;
                    console.log(info);
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
        var userImage ="";
        //Si no recibe una imagen de perfil le asigna una aleatoria
        if(!request.file){
            userImage = `predeterminado${Math.floor(Math.random() * 5) + 1}.jpg` ;
        }
        else{
            userImage = request.file.originalname;
        }

        mUsuarios.registerUser(
            request.body.correo,
            request.body.password,
            request.body.nick,
            userImage,
            function(err, result){
                if (err) {
                    console.log(err.message);
                    response.redirect("register");
                } else {
                    response.redirect("login");
                }
            }
        )
    }

    
}

module.exports = controllerUsuarios;