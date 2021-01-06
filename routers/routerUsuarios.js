const controllerUsuarios = require("../controllers/controllerUsuarios")
const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const cUsuarios = new controllerUsuarios();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "../public")));
router.use(express.static(path.join(__dirname, "../../public")));
router.use(express.static(path.join(__dirname, "../profile_imgs")));
router.use(express.static(path.join(__dirname, "../../profile_imgs")));

// function isUserLogged(request, response, next){
//     if (request.session.currentUser === undefined) {
//         response.redirect("/loginout/login");
//     } else {
//          //response.locals = { userEmail: request.session.currentUser };
//         //response.locals = { userID: request.session.currentUserID };
//         response.locals = { userNick : request.session.currentUserNick, userID: request.session.currentUserID };
//         next();
//     }
// }

// router.use(isUserLogged);


router.get("/", cUsuarios.getUsuarios);

router.get("/filtrar" ,cUsuarios.getUsuariosFiltrar);

router.get("/perfil/:idUsuario" ,cUsuarios.getPerfilUsuario);



module.exports = router;