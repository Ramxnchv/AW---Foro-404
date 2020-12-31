
const controllerUsuarios = require("../controllers/controllerUsuarios")
const express = require("express");
const router = express.Router();
const cUsuarios = new controllerUsuarios();


router.get("/login", cUsuarios.getLogin);

router.post("/login",cUsuarios.postLogin);

router.get("/register.html",cUsuarios.getRegister);

router.post("/register",cUsuarios.postRegister);




module.exports = router;