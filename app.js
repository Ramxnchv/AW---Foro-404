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

const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const middlewareSession = session({
    saveUninitialized: false,
    secret: "404",
    resave: false,
    store: sessionStore
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewareSession);

//ROUTERS

const loginOutRouter = require("./routers/routerLoginOut");
const preguntasRouter = require("./routers/routerPreguntas");

app.use("/loginout",loginOutRouter);
app.use("/preguntas",preguntasRouter);

//MIDDLEWARES

function isUserLogged(request, response, next){
    if (request.session.currentUser === undefined) {
        response.redirect("/loginout/login");
    } else {
        
        //response.locals = { userEmail: request.session.currentUser };
        response.locals = { userNick : request.session.currentUserNick };
        next();
    }
}

//MANEJADORES DE RUTAS

app.get("/index",isUserLogged, function (request, response) {
    response.render("index");         
});

app.get("/logout",isUserLogged, function (request, response) {
    request.session.destroy();
    response.redirect("/loginout/login")       
});

app.get("/imagenUsuario", isUserLogged, function (request, response) {
    response.sendFile(path.join(__dirname, "profile_imgs", request.session.currentUserImg));  
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
 