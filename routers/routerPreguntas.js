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

router.get("/", cPreguntas.getPreguntas);

router.get("/formular",cPreguntas.getFormularPregunta);

router.post("/formular",cPreguntas.postFormularPregunta);

router.get("/etiquetadas/:idEtiqueta", cPreguntas.getPreguntasPorEtiqueta);

router.get("/sinresponder", cPreguntas.getPreguntasSinResponder);

router.get("/buscar", cPreguntas.getPreguntasPorTexto);

router.get("/:idPregunta", cPreguntas.getPregunta);

module.exports = router;