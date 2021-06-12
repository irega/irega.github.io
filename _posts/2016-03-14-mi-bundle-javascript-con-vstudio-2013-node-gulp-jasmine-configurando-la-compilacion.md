---
layout: post
title: Mi Bundle JavaScript con VStudio 2013 + Node + Gulp + Jasmine
subtitle: (III) Configurando la compilación
tags: [JavaScript]
---

**ÍNDICE:**
- [(I) Introducción]({% post_url 2016-03-12-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-introduccion %})
- [(II) Estructurando mi código]({% post_url 2016-03-13-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-estructurando-mi-codigo %})
- [(III) Configurando la compilación]({% post_url 2016-03-14-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-configurando-la-compilacion %})
- [(IV) Minificando y testeando]({% post_url 2016-03-20-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-iv-minificando-y-testeando %})

**PROYECTO DE EJEMPLO:**

[https://github.com/irega/GulpJavaScriptBundle](https://github.com/irega/GulpJavaScriptBundle)

En esta nueva entrega vamos a aprender a configurar la generación del bundle en el momento de la compilación del proyecto de Visual Studio. Lo primero que haremos es establecer una tarea “Pre-Build” desde la página de propiedades del proyecto:

![Pre-build event config](/assets/img/gulp_prebuild_event.png){: .mx-auto.d-block :}

Con ello estamos indicando a Visual Studio que al compilar el proyecto ejecute el archivo “build.bat”. Dentro de este archivo vamos a añadir el siguiente contenido:

{% highlight bat linenos %}
call npm install
call node ..\..\node_modules\gulp\bin\gulp
{% endhighlight %}

**¿Y estas líneas que significan?** “build.bat” es un archivo que al ejecutar levanta una consola de comandos (en este caso de Windows) y ejecuta esos dos comandos sobre ella. Con el primero de todos estamos utilizando desde la consola el instalador de paquetes de Node.js. Le estamos diciendo que instale el paquete situado en nuestra carpeta de proyecto (que es desde donde se está ejecutando el archivo .bat). El paquete en cuestión no es más que nuestro bundle. Este comando leerá el archivo **“package.json”** de nuestro proyecto que contendrá la información y las dependencias que necesita nuestro paquete para ser instalado. Y es que para eso necesitamos este paso, para que Node nos instale las dependencias que necesitaremos posteriormente para generar nuestro bundle. Por ejemplo necesitaremos que nos instale el módulo Gulp.

Estos módulos se instalarán en la carpeta “node_modules” que nos creará Node dentro de la carpeta de nuestro proyecto. Con la segunda línea estamos ejecutando desde esa carpeta de instalación, el módulo Gulp. Éste, ejecutará a su vez el código del archivo **“gulpfile.js”** del proyecto, donde le habremos indicado las tareas que tiene que lanzar. Esas tareas serán de las que hablábamos [en la primera entrega del tutorial]({% post_url 2016-03-12-mi-bundle-javascript-con-vstudio-2013-node-gulp-jasmine-introduccion %}). Por ejemplo la tarea de generación del bundle en sí, o la tarea de minificación de éste. El literal “..\..\” que precede a la ruta de Gulp en este comando, hay que indicarlo porque la compilación de nuestro proyecto de Visual Studio se realiza sobre el directorio “bin\Debug”, y “node_modules” se encuentra en un directorio superior.

Antes de definir el contenido de los ficheros “package.json” y “gulpfile.js”, debemos instalar Node.js en nuestro ordenador, para que desde la consola de comandos de Windows se pueda acceder al comando “npm”. Podéis descargaros el instalador desde aquí:

[https://nodejs.org/](https://nodejs.org/)

Una vez instalado, vamos a definir el contenido de nuestro “package.json” para indicar la información de nuestro bundle y los módulos que necesitamos:

{% highlight json linenos %}
{
  "name": "GulpJavaScriptBundle",
  "version": "1.0.0",
  "description": "Librería de gestión de padres e hijos",
  "author": "irega",
  "dependencies": {},
  "devDependencies": {
    "gulp": "^3.9.0",
    "browserify": "^12.0.1",
    "fs": "0.0.2"
  }
}
{% endhighlight %}

En “devDependencies” indicaremos los módulos que necesitamos, de momento nos vale con **“gulp”** (“ejecutor” de tareas predefinidas), **“browserify”** (librería que leerá las dependencias de nuestro código JavaScript y generará el *.js final) y **“fs”** (para escribir el contenido de ese *.js final en el sistema de archivos de nuestro PC). Acompañando a los nombres de los módulos, tenemos la versión que requerimos de cada uno de ellos. Para facilitar toda esta tarea, existe una extensión para Visual Studio 2013 que nos añade Intellisense a la edición del “pacakage.json”:

[https://visualstudiogallery.msdn.microsoft.com/65748cdb-4087-497e-a394-2e3449c8e61e](https://visualstudiogallery.msdn.microsoft.com/65748cdb-4087-497e-a394-2e3449c8e61e)

![Package.json intellisense](/assets/img/js_bundle_package_json.png){: .mx-auto.d-block :}

Como podéis ver, bastante útil. Por último, vamos a configurar nuestras tareas de Gulp en el archivo “gulpfile.js”:

{% highlight js linenos %}
var gulp = require('gulp');
var browserify = require('browserify');
var fs = require('fs');
 
var bundler = browserify("./src/js/lib.js");
 
gulp.task('bundle-js', function () {
    bundler.bundle()
    .pipe(fs.createWriteStream('bin/miLibreria.js'));
});
 
gulp.task('default', ['bundle-js']);
{% endhighlight %}

Aunque el código es bastante simple, ahí va una pequeña explicación. Con **browserify(“./src/js/lib.js”)** lo que hacemos es decirle a browserify que lea el archivo JavaScript que contiene nuestro módulo inicial y resuelva todas las dependencias que hemos definido en nuestro código con las funciones “require” y “exports”.

Después definimos dos tareas para Gulp: “bundle-js” y “default”. “default” es el punto de entrada y la tarea por defecto que ejecutará Gulp, por lo que vinculamos su ejecución a “bundle-js”. Esta otra tarea utilizará la función “bundle” sobre el objeto creado anteriormente por browserify para generar el código JavaScript final compatible con cualquier navegador y con todas las dependencias resueltas. Por último enlazamos ese resultado mediante la función “pipe” a la función “createWriteStream” de “fs” para escribir todo ese contenido en el disco duro en forma de fichero (miLibreria.js).

Finalmente, si compilamos nuestro proyecto desde Visual Studio, podremos comprobar que nuestro bundle ha sido generado en el directorio configurado (‘bin/miLibreria.js’).

Próximamente, otro capítulo 😀