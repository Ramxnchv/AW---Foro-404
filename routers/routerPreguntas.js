const controllerPreguntas = require("../controllers/controllerPreguntas")
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const router = express.Router();
const cPreguntas = new controllerPreguntas();

router.get("/", cPreguntas.getPreguntas);

router.get("/formular", cPreguntas.getFormularPregunta);

router.post("/formular", cPreguntas.postFormularPregunta);

router.get("/etiquetadas/:idEtiqueta", cPreguntas.getPreguntasPorEtiqueta);

router.get("/sinresponder", cPreguntas.getPreguntasSinResponder);

router.get("/buscar", cPreguntas.getPreguntasPorTexto);

router.get("/:idPregunta", cPreguntas.getPregunta);

router.post("/:idPregunta/nuevarespuesta", cPreguntas.postRespuesta);

router.post("/:idPregunta/votopositivo", cPreguntas.postVotoPositivo);

router.post("/:idPregunta/votonegativo", cPreguntas.postVotoNegativo);

router.post("/:idPregunta/:idRespuesta/votopositivo", cPreguntas.postVotoRespuestaPositivo);

router.post("/:idPregunta/:idRespuesta/votonegativo", cPreguntas.postVotoRespuestaNegativo);


module.exports = router;