const config = require("./config");
const DAOQuestions = require("./DAOQuestions");
const DAOUsers = require("./DAOUsers");
//const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const bodyParser = require("body-parser");
const morgan = require("morgan");
const multer = require("multer");
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

// Crear una instancia de DAOQuestions
const daoQ = new DAOQuestions(pool);

// Crear una instancia de DAOUsers
const daoU = new DAOUsers(pool);

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

function isUserLogged(request, response, next){
    if (request.session.currentUser === undefined) {
        response.redirect("/login");
    } else {
        response.locals = { userEmail: request.session.currentUser };
        next();
    }
}

app.get("/login", function (request, response) {
    response.render("login", { errorMsg: null });
});

app.post("/login", function (request, response) {
    daoU.isUserCorrect(request.body.correo,
        request.body.password, function (error, ok) {
            if (error) { // error de acceso a la base de datos
                response.status(500);
                console.log("error");
                response.render("login", { errorMsg: "Error interno de acceso a la base de datos" });
            }
            else if (ok) {
                request.session.currentUser = request.body.correo;
                console.log("ok");
                response.redirect("/preguntas.html");
            } 
            else {
                response.status(200);
                console.log("contraseña invalida");
                response.render("login", { errorMsg: "Dirección de correo y/o contraseña no válidos" });
            }
        }
    );
});

app.get("/preguntas", isUserLogged, function(request, response) {
    daoT.getAllQuestions(function(err,taskList){
        if (err) {
            console.log(err.message);
        } else {
            //response.render("tasks", { tasks: taskList});
            response.redirect("/preguntas");
        }
    });
});

















// Arrancar el servidor
app.listen(config.port, function(err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
 });
 