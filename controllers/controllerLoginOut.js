const express = require("express");
const path = require("path");
const multer = require("multer");
const multerFactory = multer({storage:multer.memoryStorage()});
const DAOUsers = require("../models/DAOUsers");
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
const daoU = new DAOUsers(pool);

const loginOutRouter = express.Router();
loginOutRouter.use(middlewareSession);

function isUserLogged(request, response, next){
    if (request.session.currentUser === undefined) {
        response.redirect("/loginout/login");
    } else {
        response.locals = { userEmail: request.session.currentUser };
        next();
    }
}

const ficherosEstaticos = path.join(__dirname, "../public");
loginOutRouter.use(express.static(ficherosEstaticos));


loginOutRouter.get("/login", function (request, response) {
    response.render("login", { errorMsg: null });
});

loginOutRouter.post("/login", function (request, response) {
    daoU.isUserCorrect(request.body.correo,
        request.body.password, function (error, ok) {
            if (error) { // error de acceso a la base de datos
                response.status(500);
                response.render("login", { errorMsg: "Error interno de acceso a la base de datos" });
            }
            else if (ok) {
                request.session.currentUser = request.body.correo;
                response.render("index");
            } 
            else {
                response.status(200);
                response.render("login", { errorMsg: "Dirección de correo y/o contraseña no válidos" });
            }
        }
    );
});

loginOutRouter.post("/register", multerFactory.single("foto"), function(request,response){
    
   //TODO 
   //asignar una imagen aleatoria si no introduce una foto
    daoU.registerUser(
        request.body.correo,
        request.body.password,
        request.body.nick,
        request.file.buffer,
        function(err, result){
            if (err) {
                console.log(err.message);
                response.redirect("login");
            } else {
                response.redirect("login");
            }
        }
    )
})

loginOutRouter.get("/logout", isUserLogged, function (request, response) {
    request.session.destroy();
    response.redirect("login");
});



module.exports = loginOutRouter;