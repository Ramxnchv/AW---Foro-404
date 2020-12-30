const express = require("express");
const app = express();
const loginOutRouter = express.Router();

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
                response.render("index");
            } 
            else {
                response.status(200);
                console.log("contraseña invalida");
                response.render("login", { errorMsg: "Dirección de correo y/o contraseña no válidos" });
            }
        }
    );
});

app.get("/logout", isUserLogged, function (request, response) {

    request.session.destroy();
    response.redirect("login");
            
});








module.exports = loginOutRouter;