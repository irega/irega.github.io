---
layout: post
title: Mi Bundle JavaScript con VStudio 2013 + Node + Gulp + Jasmine
subtitle: (IV) Minificando y testeando
tags: [JavaScript]
---

**ÍNDICE:**
- [(I) Introducción]({% post_url 2016-03-12-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-introduccion %})
- [(II) Estructurando mi código]({% post_url 2016-03-13-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-estructurando-mi-codigo %})
- [(III) Configurando la compilación]({% post_url 2016-03-14-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-configurando-la-compilacion %})
- [(IV) Minificando y testeando]({% post_url 2016-03-20-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-iv-minificando-y-testeando %})

**PROYECTO DE EJEMPLO:**

[https://github.com/irega/GulpJavaScriptBundle](https://github.com/irega/GulpJavaScriptBundle)

Para finalizar este pequeño tutorial, en este último capítulo completaremos la generación de nuestro bundle con dos tareas más. Una de ellas nos servirá para minificar el código final y la otra nos permitirá asegurar nuestro código mediante tests de cliente con Jasmine. Para ello, lo primero que debemos hacer es requerir los nuevos módulos que necesitaremos en el archivo “package.json”:

{% highlight json linenos %}
{
    "name": "GulpJavaScriptBundle",
    "version": "1.0.0",
    "description": "Librería de gestión de padres e hijos",
    "author": "irega",
    "dependencies": { },
    "devDependencies": {
        "gulp": "^3.9.0",
        "browserify": "^12.0.1",
        "fs": "0.0.2",
        "gulp-jasmine": "^2.3.0",
        "uglifyify": "^3.0.1"
    }
}
{% endhighlight %}

Utilizaremos “gulp-jasmine” para programar la ejecución de nuestros tests de Jasmine y “uglifyify” para minificar el código de nuestro bundle. A continuación, crearemos un test unitario para probar por ejemplo el módulo “gestorPadres”:

{% highlight js linenos %}
var GestorPadres = require('../src/js/padres/gestorPadres.js');
 
describe("El gestor de padres", function () {
    it("crea un padre válido", function () {
        var datosNuevoPadre = {
            Nombre: "Darth Vader",
            Anios: "65",
            Empleo: "Sith"
        };
        
        var gestorPadres = new GestorPadres();
        var nuevoPadre = gestorPadres.crear(datosNuevoPadre);
        expect(nuevoPadre.Nombre).toBe(datosNuevoPadre.Nombre);
        expect(nuevoPadre.Anios).toBe(datosNuevoPadre.Anios);
        expect(nuevoPadre.Empleo).toBe(datosNuevoPadre.Empleo);
    });
});
{% endhighlight %}

El test lo hemos creado en el archivo “gestorPadres.Spec.js”, dentro de la carpeta “.tests” del proyecto de ejemplo. Nos resultaría útil que este test se ejecutará en una tarea justo antes de la propia generación del bundle final, para asegurar que las posibles modificaciones que hayamos realizado sobre el módulo “gestorPadres” son completamente válidas y no afecta a la funcionalidad de nuestra librería. Por tanto, sólo nos quedaría programar nuestra tarea en el archivo “gulpfile.js”:

{% highlight js linenos %}
var gulp = require('gulp');
var browserify = require('browserify');
var fs = require('fs');
var jasmine = require('gulp-jasmine');
var uglify = require('uglifyify');
 
var bundler = browserify("./src/js/lib.js");
bundler.transform('uglifyify');
 
gulp.task('specs', function () {
    return gulp.src('./.tests/gestorPadres.Spec.js')
        .pipe(jasmine());
});
 
gulp.task('bundle-js', function () {
    bundler.bundle()
    .pipe(fs.createWriteStream('bin/miLibreria.js'));
});
 
gulp.task('default', ['specs', 'bundle-js']);
{% endhighlight %}

Con var **jasmine = require(‘gulp-jasmine’);** cargaremos el módulo “gulp-jasmine” al inicio, para utilizarlo posteriormente en la tarea “specs” que definiremos. En esta tarea, solo debemos indicar la localización de nuestros tests de Jasmine. En este caso, cargaremos únicamente el archivo “gestorPadres.Spec.js” con “gulp.src” y el resultado de esta instrucción lo enlazaremos a la ejecución del módulo “jasmine” mediante “pipe”. Por último, no debemos olvidar indicar la ejecución de “specs” dentro de la tarea “default”.

Para el tema de la minificación, sólo debemos requerir la carga del módulo “uglifyify” y ejecutarlo con **bundler.transform(‘uglifyify’);**. Y llegados a este punto, ya tendremos nuestro bundle JavaScript estructurado mediante módulos, concatenados en un sólo archivo, con el código minificado y probado con tests unitarios. Todo esto gracias a Node, Gulp, Jasmine, Browserify, Uglifyify, etc. Como podéis ver, existe un catálogo inmenso de módulos que nos brindan infinitas posibilidades y que no para de crecer día a día. Intentaré en futuros posts dar a conocer unos cuantos más. Saludos!!