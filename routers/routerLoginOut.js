
const controllerUsuarios = require("../controllers/controllerUsuarios");
const express = require("express");
const router = express.Router();
const cUsuarios = new controllerUsuarios();

const path = require("path");
const multer  = require('multer')

//Le asigna el destino donde guardará la imagen y la guardará con su nombre
const storage = multer.diskStorage({
    destination : path.join(__dirname,"../profile_imgs"),
    filename:(req,file,cb) => {
        cb(null,file.originalname);
    }
})

const multerFactory = multer({ storage });


router.get("/login", cUsuarios.getLogin);

router.post("/login",cUsuarios.postLogin);

router.get("/register.html",cUsuarios.getRegister);

router.post("/register", multerFactory.single("foto"), cUsuarios.postRegister);




module.exports = router;