---
layout: post
title: Mi Bundle JavaScript con VStudio 2013 + Node + Gulp + Jasmine
subtitle: (II) Estructurando mi código
tags: [JavaScript]
---

**ÍNDICE:**
- [(I) Introducción]({% post_url 2016-03-12-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-introduccion %})
- [(II) Estructurando mi código]({% post_url 2016-03-13-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-estructurando-mi-codigo %})
- [(III) Configurando la compilación]({% post_url 2016-03-14-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-configurando-la-compilacion %})
- [(IV) Minificando y testeando]({% post_url 2016-03-20-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-iv-minificando-y-testeando %})

**PROYECTO DE EJEMPLO:**

[https://github.com/irega/GulpJavaScriptBundle](https://github.com/irega/GulpJavaScriptBundle)

[En el anterior capítulo]({% post_url 2016-03-12-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-introduccion %}) aprendimos lo que era un bundle y a generar la estructura básica del proyecto en Visual Studio. Ahora vamos a ver como escribir y organizar nuestro código JavaScript para que Node.js sea capaz de leer y establecer las dependencias correctamente a la hora de generar el código final.

Las dos funciones principales de Node son “require” y “exports”. Con “require”, indicamos que nuestro módulo JavaScript **requiere** ciertos objetos, variables o funciones declaradas en otro módulo. Con “exports” lo que indicamos es qué objetos, variables o funciones de nuestro módulo **queremos exponer al resto**. Pero, ¿qué es un módulo? Pues un módulo no es más que un fichero *.js. Veamos un caso práctico:

Hemos incluido en la carpeta “js” todo nuestro código JavaScript:

![JavaScript bundle js folder](/assets/img/js-bundle-js-folder.png){: .mx-auto.d-block :}

Para este ejemplo, queremos realizar un bundle de una librería JavaScript que permita crear hijos, padres y nuevas relaciones entre ellos. Para ello hemos dividido el código en 6 módulos:

- gestorHijos.js: Módulo encargado de la gestión de hijos.
- hijo.js: Módulo encargado de la definición de un tipo Hijo.
- gestorPadres.js: Módulo encargado de la gestión de padres.
- padre.js: Módulo encargado de la definición de un tipo Padre.
- gestorRelaciones.js: Módulo encargado de la gestión de relaciones entre padres e hijos.
- lib.js: Es el módulo principal que expone las propiedades y funciones de la librería.

Para entender el uso de “require” y “exports” vamos a repasar por ejemplo el código de dos de los módulos:

**lib.js:**

{% highlight javascript linenos %}
var GestorPadres = require('./padres/gestorPadres');
var GestorHijos = require('./hijos/gestorHijos');
var GestorRelaciones = require('./relaciones/gestorRelaciones');
 
window.MiLibreriaJS = window.MiLibreriaJS || {};
 
(function (libreria) {
    "use strict";
 
    var instanciaGestorPadres = new GestorPadres(),
        instanciaGestorHijos = new GestorHijos(),
        instanciaGestorRelaciones = new GestorRelaciones();
 
    libreria.crearPadre = function (datosPadre) {
        return instanciaGestorPadres.crear(datosPadre);
    }
    libreria.crearHijo = function (datosHijo) {
        return instanciaGestorHijos.crear(datosHijo);
    };
    libreria.aniadirHijoAPadre = function (padre, hijo) {
        instanciaGestorRelaciones.nuevaRelacion(padre, hijo);
    }
    libreria.obtenerUltimaRelacion = instanciaGestorRelaciones.obtenerUltimaRelacion;
 
}(window.MiLibreriaJS));
{% endhighlight %}

Este es el módulo principal, que define qué funciones o propiedades tiene la librería y son accesibles desde fuera. Básicamente expone las funciones del resto de módulos. Cuando digo “desde fuera” me refiero desde el código JavaScript que haga uso de nuestra librería. Todo lo que queramos exponer deberemos introducirlo en la variable “window”. En este caso exponemos un objeto con cuatro funciones:

- crearPadre: Crea y devuelve un nuevo objeto Padre.
- crearHijo: Crea y devuelve un nuevo objeto Hijo.
- aniadirHijoAPadre: Crea una nueva relación entre un padre y un hijo.
- obtenerUltimaRelacion: Obtiene la última relación creada.

Como podemos ver al principio del código, usamos la función “require” para decirle a Node los módulos que necesito para el código de mi módulo actual. Voy a utilizar por ejemplo el tipo GestorHijos, pero este tipo está definido en el módulo gestorHijos.js. Por tanto, con **var GestorHijos = require(‘./hijos/gestorHijos’);** cargo en la variable GestorHijos todo el código exportado en el módulo origen. Como podéis ver, el parámetro de la función require no es más que la ruta del archivo *.js que contiene la definición del módulo requerido.

**gestorHijos.js:**

{% highlight javascript linenos %}
var Hijo = require('./hijo');
 
var obtenerTipoGestorHijos = (function () {
    var GestorHijos = function () {
        var self = this;
        self.crear = crear;
    };
 
    function crear(datosHijo) {
        var nuevoHijo = new Hijo();
        nuevoHijo.Nombre = datosHijo.Nombre;
        nuevoHijo.Anios = datosHijo.Anios;
        nuevoHijo.Altura = datosHijo.Altura;
        return nuevoHijo;
    }
 
    return GestorHijos;
})();
 
module.exports = obtenerTipoGestorHijos;
{% endhighlight %}

Por otro lado, en el otro módulo que he requerido en “lib.js” declaro un objeto con las propiedades y funciones que quiero exponer, y seguidamente con **module.exports = obtenerTipoGestorHijos;** lo expongo explícitamente y le digo a Node que este objeto se trata de un módulo.

Ahora me vais a permitir que me salte unos cuantos capítulos y veamos muy por encima la estructura del bundle que se debería generar, pero sin minificar:

{% highlight javascript linenos %}
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({
 
//Define el primer módulo
1: [function(require,module,exports){
var Hijo = require('./hijo');
 
var obtenerTipoGestorHijos = (function () {
    var GestorHijos = function () {
        var self = this;
        self.crear = crear;
    };
 
    function crear(datosHijo) {
        var nuevoHijo = new Hijo();
        nuevoHijo.Nombre = datosHijo.Nombre;
        nuevoHijo.Anios = datosHijo.Anios;
        nuevoHijo.Altura = datosHijo.Altura;
        return nuevoHijo;
    }
 
    return GestorHijos;
})();
 
module.exports = obtenerTipoGestorHijos;
},
 
//Define las dependencias del primer módulo
{"./hijo":2}],
 
//Define el segundo módulo
2: [function(require,module,exports){
var obtenerTipoHijo = (function () {
    var Hijo = function () {
        var self = this;
        self.Nombre = "";
        self.Anios = "";
        self.Altura = "";
    };
    return Hijo;
})();
 
module.exports = obtenerTipoHijo;
},
 
//Define las dependencias del segundo módulo (no tiene ninguna)
{}]
 
//...Resto de código generado
{% endhighlight %}

Observad como se genera una función que contiene un object literal con propiedades indexadas por un valor numérico. Cada número corresponde a uno de nuestros módulos y justo después se definen sus dependencias y se relaciona con el resto de módulos en base a estos valores numéricos. Y también observad, que al estar todo el código contenido en una función de JavaScript, tal y como hemos comentado la única manera de exponer nuestra librería al exterior es mediante la variable “window”. Después de esto entendemos más o menos porque debemos estructurar nuestro código por módulos, ¿no?

[En el siguiente capítulo]({% post_url 2016-03-14-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-configurando-la-compilacion %}) aprenderemos a generar el código JavaScript final de nuestro bundle al compilar la solución de Visual Studio.