const config = require("./config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");

const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database });

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);
const moldelUsuarios = require("./models/modelUsuarios");
const modelPreguntas = require("./models/modelPreguntas");
const mUsuarios = new moldelUsuarios(pool);
const mPreguntas = new modelPreguntas(pool);

//MORGAN
app.use(morgan("dev"));

//EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//STATIC
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "profile_imgs")));

//SESION
const middlewareSession = session({
    saveUninitialized: false,
    secret: "404",
    resave: false,
    store: sessionStore
});

//BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewareSession);

//ROUTERS

const loginOutRouter = require("./routers/routerLoginOut");
const preguntasRouter = require("./routers/routerPreguntas");
const usuariosRouter = require("./routers/routerUsuarios");

app.use("/loginout",loginOutRouter);

//MIDDLEWARE CONTROL SESION

function isUserLogged(request, response, next){
    if (request.session.currentUser === undefined) {
        response.redirect("/loginout/login");
    } else {
        response.locals = { userNick : request.session.currentUserNick,
            userID: request.session.currentUserID,
            userImg: request.session.currentUserImg
            };
        next();
    }
}

//USO DE MIDDLEWARE CONTROL SESION
app.use(isUserLogged);

//USO DE ROUTERS
app.use("/preguntas",preguntasRouter);
app.use("/usuarios",usuariosRouter);

//MANEJADORES DE RUTAS

app.get("/", function (request, response) {
    response.redirect("/loginout/login");       
});

app.get("/index", function (request, response,next) {
    response.render("index");        
});

app.get("/logout", function (request, response) {
    request.session.destroy();
    response.redirect("/loginout/login");      
});

// MIDDLEWARE 404
app.use(function (request, response, next) {
    response.status(404);
    response.render("error404", { url: request.url });
});


// MIDDLEWARE 500
app.use(function (error, request, response, next) {
    // Código 500: Internal server error
    response.status(500);
    response.render("error500", {
        mensaje: error.message,
        pila: error.stack
    });
});

//ARRANCAR EL SERVIDOR
app.listen(config.port, function(err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
 });
 