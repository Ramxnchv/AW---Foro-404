-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-01-2021 a las 21:23:49
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiqueta`
--

CREATE TABLE `etiqueta` (
  `nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `etiqueta`
--

INSERT INTO `etiqueta` (`nombre`) VALUES
('css'),
('css3'),
('html'),
('JavaScript'),
('mysql'),
('nodejs'),
('sql');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiquetapregunta`
--

CREATE TABLE `etiquetapregunta` (
  `nombreEtiqueta` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `idPregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `etiquetapregunta`
--

INSERT INTO `etiquetapregunta` (`nombreEtiqueta`, `idPregunta`) VALUES
('css', 1),
('css', 2),
('css3', 1),
('html', 2),
('JavaScript', 3),
('mysql', 5),
('nodejs', 4),
('sql', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medalla`
--

CREATE TABLE `medalla` (
  `id` int(11) NOT NULL,
  `metal` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `emailUsuario` varchar(50) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id` int(11) NOT NULL,
  `emailCreador` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `numVisitas` int(11) NOT NULL DEFAULT 0,
  `titulo` varchar(500) COLLATE utf8_spanish2_ci NOT NULL,
  `texto` varchar(1000) COLLATE utf8_spanish2_ci NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `puntos` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id`, `emailCreador`, `numVisitas`, `titulo`, `texto`, `fecha`, `puntos`) VALUES
(1, 'nico@404.es', 0, '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', '2021-01-13', 0),
(2, 'roberto@404.es', 0, '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', '2021-01-13', 0),
(3, 'sfg@404.es', 0, 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\r\n\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también compara el tipo (como un equals de java).\r\n', '2021-01-13', 0),
(4, 'marta@404.es', 0, 'Problema con asincronismo en Node', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.', '2021-01-13', 0),
(5, 'lucas@404.es', 0, '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL.\r\n\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.\r\n', '2021-01-13', 0);

--
-- Disparadores `pregunta`
--
DELIMITER $$
CREATE TRIGGER `crearMedallaVisitasPregunta` AFTER UPDATE ON `pregunta` FOR EACH ROW BEGIN
DECLARE visitas INT;
	SELECT pregunta.numVisitas INTO visitas
    FROM pregunta
    WHERE pregunta.id = NEW.id;
    IF visitas = 2 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Pregunta popular",NEW.emailCreador);
    ELSEIF visitas = 4 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("plata","Pregunta destacada",NEW.emailCreador);
    ELSEIF visitas = 6 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("oro","Pregunta famosa",NEW.emailCreador);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id` int(11) NOT NULL,
  `emailCreador` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `texto` varchar(1000) COLLATE utf8_spanish2_ci NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT 0,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `idPregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `respuesta`
--

INSERT INTO `respuesta` (`id`, `emailCreador`, `texto`, `puntos`, `fecha`, `idPregunta`) VALUES
(1, 'lucas@404.es', 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella.\r\n\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial\r\n', 0, '2021-01-13', 1),
(2, 'emy@404.es', 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.', 0, '2021-01-13', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('pWbkTY58CRzR88SC3Ed0Pkep1wN3tgMQ', 1610655593, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"lucas@404.es\",\"currentUserNick\":\"Lucas\",\"currentUserImg\":\"defecto1.png\",\"currentUserID\":5}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID` int(11) NOT NULL,
  `email` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `nick` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `contraseña` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `reputacion` int(11) NOT NULL DEFAULT 1,
  `fechaAlta` date NOT NULL DEFAULT current_timestamp(),
  `imagen` varchar(60) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID`, `email`, `nick`, `contraseña`, `reputacion`, `fechaAlta`, `imagen`) VALUES
(6, 'emy@404.es', 'Emy', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 1, '2021-01-13', 'amy.png'),
(5, 'lucas@404.es', 'Lucas', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 1, '2021-01-13', 'defecto1.png'),
(4, 'marta@404.es', 'Marta', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 1, '2021-01-13', 'marta.png'),
(1, 'nico@404.es', 'Nico', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 1, '2021-01-13', 'nico.png'),
(2, 'roberto@404.es', 'Roberto', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 1, '2021-01-13', 'roberto.png'),
(3, 'sfg@404.es', 'SFG', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 1, '2021-01-13', 'sfg.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votopregunta`
--

CREATE TABLE `votopregunta` (
  `idpregunta` int(11) NOT NULL,
  `emailusuario` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `voto` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Disparadores `votopregunta`
--
DELIMITER $$
CREATE TRIGGER `crearMedallaVotosPregunta` AFTER INSERT ON `votopregunta` FOR EACH ROW BEGIN

DECLARE votos INT;
DECLARE rep INT;
DECLARE emailAutor VARCHAR(30);

	SELECT SUM(votopregunta.voto) INTO @votos
    FROM votopregunta
    WHERE votopregunta.idpregunta = NEW.idpregunta;
    
    SELECT usuario.reputacion INTO @rep
    FROM usuario JOIN pregunta ON usuario.email = pregunta.emailCreador
    WHERE pregunta.id = NEW.idpregunta
    LIMIT 1;
    
    SELECT usuario.email INTO @emailAutor
    FROM usuario JOIN pregunta ON usuario.email = pregunta.emailCreador
    WHERE pregunta.id = NEW.idpregunta
    LIMIT 1;
    
    UPDATE pregunta SET puntos = @votos WHERE pregunta.id = NEW.idpregunta;
    
    IF NEW.voto = 1 THEN
		SET @rep = @rep + 10;
	ELSE
		SET @rep = @rep - 2;
		IF @rep < 1 THEN
    		SET @rep = 1;
   		END IF;   
	END IF;
    
    UPDATE usuario SET reputacion = @rep WHERE usuario.email = @emailAutor;
    
    IF votos = 1 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Estudiante",@emailAutor);
    ELSEIF votos = 2 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Pregunta interesante",@emailAutor);
    ELSEIF votos = 4 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("plata","Buena pregunta",@emailAutor);
    ELSEIF votos = 6 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("oro","Excelente pregunta",@emailAutor);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `updateVotoPregunta` AFTER UPDATE ON `votopregunta` FOR EACH ROW BEGIN

DECLARE votos INT;
DECLARE rep INT;
DECLARE emailAutor VARCHAR(30);

	SELECT SUM(votopregunta.voto) INTO @votos
    FROM votopregunta
    WHERE votopregunta.idpregunta = NEW.idpregunta;
    
    SELECT usuario.reputacion INTO @rep
    FROM usuario JOIN pregunta ON usuario.email = pregunta.emailCreador
    WHERE pregunta.id = NEW.idpregunta
    LIMIT 1;
    
    SELECT usuario.email INTO @emailAutor
    FROM usuario JOIN pregunta ON usuario.email = pregunta.emailCreador
    WHERE pregunta.id = NEW.idpregunta
    LIMIT 1;
    
    UPDATE pregunta SET puntos = @votos WHERE pregunta.id = NEW.idpregunta;
    
    IF OLD.voto = -1 AND NEW.voto = 1 THEN
    	IF @rep = 1 THEN
			SET @rep = @rep + 10;
        ELSE
        	SET @rep = @rep + 12;
        END IF;
    ELSEIF OLD.voto = 1 AND NEW.voto = -1 THEN
    	SET @rep = @rep - 12;
		IF @rep < 1 THEN
    		SET @rep = 1;
   		END IF; 
	ELSE
		SET @rep = @rep;  
	END IF;
    
    UPDATE usuario SET reputacion = @rep WHERE usuario.email = @emailAutor;
    
    IF votos = 1 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Estudiante",@emailAutor);
    ELSEIF votos = 2 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Pregunta interesante",@emailAutor);
    ELSEIF votos = 4 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("plata","Buena pregunta",@emailAutor);
    ELSEIF votos = 6 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("oro","Excelente pregunta",@emailAutor);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votorespuesta`
--

CREATE TABLE `votorespuesta` (
  `idRespuesta` int(11) NOT NULL,
  `emailUsuario` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `voto` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Disparadores `votorespuesta`
--
DELIMITER $$
CREATE TRIGGER `crearMedallaVotosRespuesta` AFTER INSERT ON `votorespuesta` FOR EACH ROW BEGIN

DECLARE votos INT;
DECLARE rep INT;
DECLARE emailAutor VARCHAR(30);

	SELECT SUM(votorespuesta.voto) INTO @votos
    FROM votorespuesta
    WHERE votorespuesta.idRespuesta = NEW.idRespuesta;
    
    SELECT usuario.reputacion INTO @rep
    FROM usuario JOIN respuesta ON usuario.email = respuesta.emailCreador
    WHERE respuesta.id = NEW.idRespuesta
    LIMIT 1;
    
    SELECT usuario.email INTO @emailAutor
    FROM usuario JOIN respuesta ON usuario.email = respuesta.emailCreador
    WHERE respuesta.id = NEW.idRespuesta
    LIMIT 1;
    
    UPDATE respuesta SET puntos = @votos WHERE respuesta.id = NEW.idRespuesta;
    
    IF NEW.voto = 1 THEN
		SET @rep = @rep + 10;
	ELSE
		SET @rep = @rep - 2;
		IF @rep < 1 THEN
    		SET @rep = 1;
   		END IF;   
	END IF;
    
    UPDATE usuario SET reputacion = @rep WHERE usuario.email = @emailAutor;
    
    IF votos = 1 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Estudiante",@emailAutor);
    ELSEIF votos = 2 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Respuesta interesante",@emailAutor);
    ELSEIF votos = 4 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("plata","Buena respuesta",@emailAutor);
    ELSEIF votos = 6 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("oro","Excelente respuesta",@emailAutor);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `updateVotoRespuesta` AFTER UPDATE ON `votorespuesta` FOR EACH ROW BEGIN

DECLARE votos INT;
DECLARE rep INT;
DECLARE emailAutor VARCHAR(30);

	SELECT SUM(votorespuesta.voto) INTO @votos
    FROM votorespuesta
    WHERE votorespuesta.idRespuesta = NEW.idRespuesta;
    
    SELECT usuario.reputacion INTO @rep
    FROM usuario JOIN respuesta ON usuario.email = respuesta.emailCreador
    WHERE respuesta.id = NEW.idRespuesta
    LIMIT 1;
    
    SELECT usuario.email INTO @emailAutor
    FROM usuario JOIN respuesta ON usuario.email = respuesta.emailCreador
    WHERE respuesta.id = NEW.idRespuesta
    LIMIT 1;
    
    UPDATE respuesta SET puntos = @votos WHERE respuesta.id = NEW.idRespuesta;
    
    IF OLD.voto = -1 AND NEW.voto = 1 THEN
		IF @rep = 1 THEN
			SET @rep = @rep + 10;
        ELSE
        	SET @rep = @rep + 12;
        END IF;
    ELSEIF OLD.voto = 1 AND NEW.voto = -1 THEN
    	SET @rep = @rep - 12;
		IF @rep < 1 THEN
    		SET @rep = 1;
   		END IF; 
	ELSE
		SET @rep = @rep;  
	END IF;
    
    UPDATE usuario SET reputacion = @rep WHERE usuario.email = @emailAutor;
    
    IF votos = 1 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Estudiante",@emailAutor);
    ELSEIF votos = 2 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("bronce","Respuesta interesante",@emailAutor);
    ELSEIF votos = 4 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("plata","Buena respuesta",@emailAutor);
    ELSEIF votos = 6 THEN
    	INSERT INTO medalla (metal, nombre, emailUsuario) VALUES ("oro","Excelente respuesta",@emailAutor);
    END IF;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`nombre`);

--
-- Indices de la tabla `etiquetapregunta`
--
ALTER TABLE `etiquetapregunta`
  ADD PRIMARY KEY (`nombreEtiqueta`,`idPregunta`),
  ADD KEY `etiquetapregunta_ibfk_1` (`idPregunta`);

--
-- Indices de la tabla `medalla`
--
ALTER TABLE `medalla`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medalla_ibfk_1` (`emailUsuario`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`emailCreador`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `respuesta_ibfk_1` (`emailCreador`),
  ADD KEY `respuesta_ibfk_2` (`idPregunta`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `id email` (`ID`);

--
-- Indices de la tabla `votopregunta`
--
ALTER TABLE `votopregunta`
  ADD PRIMARY KEY (`idpregunta`,`emailusuario`),
  ADD KEY `fk1` (`emailusuario`);

--
-- Indices de la tabla `votorespuesta`
--
ALTER TABLE `votorespuesta`
  ADD PRIMARY KEY (`idRespuesta`,`emailUsuario`),
  ADD KEY `votorespuesta_ibfk_1` (`emailUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medalla`
--
ALTER TABLE `medalla`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `etiquetapregunta`
--
ALTER TABLE `etiquetapregunta`
  ADD CONSTRAINT `etiquetapregunta_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `etiquetapregunta_ibfk_2` FOREIGN KEY (`nombreEtiqueta`) REFERENCES `etiqueta` (`nombre`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `medalla`
--
ALTER TABLE `medalla`
  ADD CONSTRAINT `medalla_ibfk_1` FOREIGN KEY (`emailUsuario`) REFERENCES `usuario` (`email`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `email` FOREIGN KEY (`emailCreador`) REFERENCES `usuario` (`email`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `respuesta_ibfk_1` FOREIGN KEY (`emailCreador`) REFERENCES `usuario` (`email`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `respuesta_ibfk_2` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `votopregunta`
--
ALTER TABLE `votopregunta`
  ADD CONSTRAINT `fk1` FOREIGN KEY (`emailusuario`) REFERENCES `usuario` (`email`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk2` FOREIGN KEY (`idpregunta`) REFERENCES `pregunta` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `votorespuesta`
--
ALTER TABLE `votorespuesta`
  ADD CONSTRAINT `votorespuesta_ibfk_1` FOREIGN KEY (`emailUsuario`) REFERENCES `usuario` (`email`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `votorespuesta_ibfk_2` FOREIGN KEY (`idRespuesta`) REFERENCES `respuesta` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
