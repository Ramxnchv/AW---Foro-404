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
                    request.session.currentUserID = info.infoID;
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
        response.render("register" ,{ errorMsg: null });
    }

    postRegister(request,response,next){
        if (request.body.password === request.body.passwordconfirm){
            var userImage ="";
            //Si no recibe una imagen de perfil le asigna una aleatoria
            if(!request.file){
                userImage = `defecto${Math.floor(Math.random() * 3) + 1}.png` ;
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
        }else{
            response.render("register", { errorMsg: "Confirmación de contraseña invalida" });
        }
    }

    getUsuarios(request,response, next){
        mUsuarios.getAllUsers(function(err,usuariosLista){
            if(err){
                next(err);
            }
            else{
                response.render("usuarios", { usuarios: usuariosLista});
            }
        });
    }

    getUsuariosFiltrar(request,response, next){
        mUsuarios.getUsersByText(request.query.filtrarusuario,function(err,usuariosLista){
            if(err){
                next(err);
            }
            else{
                response.render("usuariosportexto", { usuarios: usuariosLista, busqueda: request.query.filtrarusuario});
            }
        });
    }

    getPerfilUsuario(request,response, next){
        mUsuarios.getUserInfo(request.params.idUsuario, function(err, usuarioInfo){
            if(err){
                next(err);
            }
            else{
                mUsuarios.getMedallas(request.params.idUsuario,function(err, medallasInfo){
                    if(err){
                        console.log(err.menssage);
                    }
                    else{
                        response.render("perfil", { usuario: usuarioInfo, medallas: medallasInfo});
                    }
                })
            }
        })
    }
}

module.exports = controllerUsuarios;