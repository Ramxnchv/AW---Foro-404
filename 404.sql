-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2020 a las 15:36:04
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.10

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
  `nombre` varchar(15) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `etiqueta`
--

INSERT INTO `etiqueta` (`nombre`) VALUES
('JS'),
('PHP');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiquetapregunta`
--

CREATE TABLE `etiquetapregunta` (
  `nombreEtiqueta` varchar(15) COLLATE utf8_spanish2_ci NOT NULL,
  `idPregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `etiquetapregunta`
--

INSERT INTO `etiquetapregunta` (`nombreEtiqueta`, `idPregunta`) VALUES
('JS', 3),
('JS', 5),
('PHP', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medalla`
--

CREATE TABLE `medalla` (
  `id` int(11) NOT NULL,
  `metal` varchar(10) COLLATE utf8_spanish2_ci NOT NULL,
  `nombre` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `emailUsuario` varchar(30) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `medalla`
--

INSERT INTO `medalla` (`id`, `metal`, `nombre`, `emailUsuario`) VALUES
(1, 'plata', 'Pregunta destacada', 'ramonros@ucm.es'),
(2, 'plata', 'Pregunta destacada', 'ramonros@ucm.es'),
(3, 'oro', 'Excelente pregunta', 'ramonros@ucm.es'),
(4, 'bronce', 'Respuesta interesante', 'ramonros@ucm.es'),
(5, 'plata', 'Buena respuesta', 'ramonros@ucm.es');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id` int(11) NOT NULL,
  `emailCreador` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `numVisitas` int(11) NOT NULL DEFAULT 0,
  `titulo` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `texto` varchar(1000) COLLATE utf8_spanish2_ci NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `puntos` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id`, `emailCreador`, `numVisitas`, `titulo`, `texto`, `fecha`, `puntos`) VALUES
(3, 'ramonros@ucm.es', 0, 'Prueba', 'Pregunta de Prueba', '2020-11-12', 0),
(4, 'ramonros@ucm.es', 0, 'pregunta php', 'blablabla php', '2020-12-09', 0),
(5, 'ramonros@ucm.es', 0, 'prueba js', 'pregunta prueba js', '2020-12-09', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id` int(11) NOT NULL,
  `emailCreador` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `texto` varchar(1000) COLLATE utf8_spanish2_ci NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT 0,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `idPregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `email` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `nick` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `contraseña` varchar(40) COLLATE utf8_spanish2_ci NOT NULL,
  `reputacion` int(11) NOT NULL DEFAULT 1,
  `fechaAlta` date NOT NULL DEFAULT current_timestamp(),
  `imagen` varchar(60) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`email`, `nick`, `contraseña`, `reputacion`, `fechaAlta`, `imagen`) VALUES
('pruebas@ucm.es', 'Usuario2', 'b766c99607d41d1729a9facaffeb07874dd37343', 1, '2020-12-10', '/resources/userImages/avatar.png'),
('ramonros@ucm.es', 'Ramxnchv', 'b766c99607d41d1729a9facaffeb07874dd37343', 1, '2020-11-12', '/resources/userImages/magdalena.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votopregunta`
--

CREATE TABLE `votopregunta` (
  `idpregunta` int(11) NOT NULL,
  `emailusuario` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `voto` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votorespuesta`
--

CREATE TABLE `votorespuesta` (
  `idRespuesta` int(11) NOT NULL,
  `emailUsuario` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `voto` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

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
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`email`);

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
  ADD KEY `votorespuesta_ibfk_1` (`emailUsuario`),
  ADD KEY `votorespuesta_ibfk_2` (`idRespuesta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medalla`
--
ALTER TABLE `medalla`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
