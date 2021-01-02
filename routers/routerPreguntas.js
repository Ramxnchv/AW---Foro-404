const controllerPreguntas = require("../controllers/controllerPreguntas")
const express = require("express");
const path = require("path");
const router = express.Router();
const cPreguntas = new controllerPreguntas();
const ficherosEstaticos = path.join(__dirname, "../public");
router.use(express.static(ficherosEstaticos));
router.use(express.static(path.join(__dirname, "../profile_imgs")));

function isUserLogged(request, response, next){
    if (request.session.currentUser === undefined) {
        response.redirect("/loginout/login");
    } else {
        response.locals = { userNick : request.session.currentUserNick };
        next();
    }
}

router.use(isUserLogged);

router.get("/", isUserLogged, cPreguntas.getPreguntas);

router.get("/formular", isUserLogged, cPreguntas.getFormularPregunta);

router.post("/formular", isUserLogged, cPreguntas.postFormularPregunta);

router.get("/etiquetadas/:idEtiqueta", isUserLogged, cPreguntas.getPreguntasPorEtiqueta);

router.get("/sinresponder", isUserLogged, cPreguntas.getPreguntasSinResponder);

router.get("/buscar", isUserLogged, cPreguntas.getPreguntasPorTexto);

router.get("/:idPregunta", isUserLogged, cPreguntas.getPregunta);

module.exports = router;