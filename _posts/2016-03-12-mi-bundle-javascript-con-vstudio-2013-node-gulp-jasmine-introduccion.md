---
layout: post
title: Mi Bundle JavaScript con VStudio 2013 + Node + Gulp + Jasmine
subtitle: (I) Introducción
tags: [JavaScript]
---

**ÍNDICE:**
- [(I) Introducción]({% post_url 2016-03-12-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-introduccion %})
- [(II) Estructurando mi código]({% post_url 2016-03-13-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-estructurando-mi-codigo %})
- [(III) Configurando la compilación]({% post_url 2016-03-14-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-configurando-la-compilacion %})
- [(IV) Minificando y testeando]({% post_url 2016-03-20-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-iv-minificando-y-testeando %})

**PROYECTO DE EJEMPLO:**

[https://github.com/irega/GulpJavaScriptBundle](https://github.com/irega/GulpJavaScriptBundle)

Aprovechando que hace poco he estado trabajando con ello, se me ha ocurrido que podía redactar una pequeña guía para aprender a generar nuestros bundles de JavaScript desde Visual Studio. Acompañando a esta guía, he subido a GitHub el proyecto de ejemplo en el que nos basaremos para que podáis consultar el código (tenéis el enlace al comienzo del artículo).

Pero lo primero de todo, **¿qué es un bundle?** ¿para qué me sirve a mí todo esto?. Un bundle de JavaScript no es más que un paquete donde podemos introducir todo el código del componente o librería JavaScript que hayamos creado, para distribuirlo de forma más fácil. Un ejemplo: jQuery. Cuando en nuestro proyecto introducimos la librería jQuery, introducimos únicamente un fichero jquery-2.2.1.min.js. Pero si yo soy uno de los desarrolladores del equipo de jQuery, ¿creéis que estoy escribiendo el código sobre ese fichero directamente? Pues no, lo que seguramente tenga es un proyecto con multitud de archivos JavaScript, uno por cada componente quizás: el gestor de selectores, el gestor de eventos, etc. ¿Y después que hago con todos esos ficheros? Pues quiero concatenarlos en uno solo, y después todo ese código quiero ofuscarlo-minificarlo para que el código sea más ligero, y además, para rizar más el rizo, quiero que cuando se genere se ejecuten unos tests unitarios con Jasmine para comprobar que mi código no tiene bugs. Para los más curiosos y que quieran constrastarlo aquí tienen el proyecto jQuery 😛

[https://github.com/jquery/jquery](https://github.com/jquery/jquery)

Resumiendo, generaremos un bundle cuando estemos desarrollando **una librería o un componente** aislado de JavaScript que luego queramos distribuir en varios proyectos. No es cuestión de empezar ahora a agrupar todo el código JavaScript de nuestra aplicación en bundles. Y por cierto, también podemos tener un bundle CSS. Imaginaros que estoy desarrollando un componente web que además de tener su propia funcionalidad tiene sus estilos. En este caso tendremos un bundle JavaScript con el código (un archivo *.js) y un bundle CSS con los estilos (un archivo *.css).

Pero bueno, como dicen por ahí, “Talk is cheap. Show me the code”:

Lo primero de todo crearemos un nuevo proyecto (Class Library) en Visual Studio, que contendrá todo nuestro código:

![JavaScript new project dialog](/assets/img/js-bundle-new-project.png){: .mx-auto.d-block :}

Una vez tenemos el proyecto creado, podemos eliminar la clase que nos habrá creado automáticamente (Class1.cs) y añadir todo nuestro código JavaScript. Lo suyo es añadirlo organizado en carpetas, en mi caso he creado una llamada “src”, y dentro de ésta, otra llamada “js” que contendrá todo mi código. Además, añadiremos 3 archivos más a la raíz del proyecto: **build.bat** (encargado de lanzar la generación del bundle), **gulpfile.js** (donde indicaremos las tareas que hay que ejecutar en la generación del bundle) y **package.json** (donde configuraremos las dependencias y el resto de información de nuestro bundle). El proyecto debería quedar así de momento:

![JavaScript bundle project structure](/assets/img/js-bundle-project-structure.png){: .mx-auto.d-block :}

[En el siguiente capítulo]({% post_url 2016-03-13-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-estructurando-mi-codigo %}), aprenderemos a estructurar todo el código de la carpeta “js” para que Node.js lo pueda interpretar en forma de módulos y se genere correctamente el código del bundle.