const controllerPreguntas = require("../controllers/controllerPreguntas")
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const router = express.Router();
const cPreguntas = new controllerPreguntas();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "../public")));
router.use(express.static(path.join(__dirname, "../../public")));
router.use(express.static(path.join(__dirname, "../profile_imgs")));
router.use(express.static(path.join(__dirname, "../../profile_imgs")));

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

router.post("/:idPregunta/nuevarespuesta", isUserLogged, cPreguntas.postRespuesta);

router.post("/:idPregunta/votopositivo", isUserLogged, cPreguntas.postVotoPositivo);

router.post("/:idPregunta/votonegativo", isUserLogged, cPreguntas.postVotoNegativo);

router.post("/:idPregunta/:idRespuesta/votopositivo", isUserLogged, cPreguntas.postVotoRespuestaPositivo);

router.post("/:idPregunta/:idRespuesta/votonegativo", isUserLogged, cPreguntas.postVotoRespuestaNegativo);


module.exports = router;