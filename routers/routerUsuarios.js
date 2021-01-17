const controllerUsuarios = require("../controllers/controllerUsuarios")
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cUsuarios = new controllerUsuarios();

router.get("/", cUsuarios.getUsuarios);

router.get("/filtrar" ,cUsuarios.getUsuariosFiltrar);

router.get("/perfil/:idUsuario" ,cUsuarios.getPerfilUsuario);

module.exports = router;