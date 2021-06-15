---
layout: post
title: Publicando el resultado de los tests ejecutados dentro de un contenedor de Docker
subtitle: Karma+Angular+Azure DevOps
tags: [DevOps]
---

Esta vez quería compartir con vosotros cómo conseguimos publicar un informe en una pipeline de Azure DevOps con el resultado de los tests de Frontend ejecutados dentro de un contenedor de Docker, que si bien de primeras puede parecer trivial, tuvimos que invertir varias jornadas para conseguirlo (posiblemente debido a mi poco conocimiento de Docker xD).

He estructurado el post en distintas secciones, que representan las partes más importantes que tenemos que tener en cuenta para configurar con éxito todo el proceso.

**1. Karma config:**

Lo primero que debemos configurar es el framework utilizado para ejecutar los tests de Frontend, en nuestro caso **Karma**. Añadiremos a la configuración los “**reporters**” necesarios para exportar el resultado de los tests en formato **Junit**:

{% highlight json linenos %}
[...]
plugins: [
   [...]
   require('karma-junit-reporter')
],
reporters: ['progress', 'junit'],
junitReporter: {
   outputDir:'../../dist/test',
   outputFile:'test-results.xml',
   useBrowserName:false
}
{% endhighlight %}

**2. package.json:**

En este archivo de nuestro proyecto Frontend, deberemos configurar el **script npm** que usaremos para ejecutar nuestros tests, además de añadir las **dependencias** necesarias:

{% highlight json linenos %}
"scripts": {
   "test": "ng test -sm=false --config ./karma.conf.js"
   [...]
},
"devDependencies": {
   "karma-junit-reporter": "^1.2.0"
   [...]
}
{% endhighlight %}

**3. Dockerfile:**

Optamos en nuestro caso por una imagen multi-stage de Docker. El aspecto de nuestro Dockerfile debe ser algo parecido a este, donde generamos el resultado de los tests en el path “/test”:

{% highlight docker linenos %}
FROM promact/docker-dotnet-nodejs as build
 
# Copiamos todo el contenido del proyecto a /build
RUN mkdir /build
COPY . /build
WORKDIR /build
 
# Instalamos las dependencias del proyecto y ejecutamos los tests
RUN npm install
RUN npm test
 
# Copiamos el resultado de los tests desde el stage anterior a /test
FROM node:7.5
RUN mkdir /test
WORKDIR /test
COPY --from=build /build/dist/test .
{% endhighlight %}

**4. Docker compose:**

Por último, para levantar nuestro contenedor usamos Docker compose. Esta es la parte más importante del proceso, ya que es la que nos dió más guerra. En su archivo de configuración, debemos definir un volumen que vincule el path “/test” del container al path “dist/test” del host, para así poder acceder al resultado de los tests.

Como véis, hay que definir unos parámetros extra que no suelen ser los habituales al definir volúmenes. Tuvimos que optar por esta forma puesto que con la nomenclatura común (../../dist/test:/test), al montar el volumen, borraba todo el contenido del path en el container, seguramente porque el contenido de la carpeta “dist/test” en el host está inicialmente vacía. Intuyo también que esto es porque nuestros resultados de los tests se generan en mitad de la construcción de la imagen de Docker y no en el entrypoint, aunque todo esto son conjeturas mias, hasta que tenga mas conocimiento de Docker 😀

La pega de este mecanismo, es que el path del host debe ser una **ruta absoluta**, por lo que nos tenemos que apoyar en la variable de entorno **PWD** que nos indica en Linux el path actual (desde el que ejecutaremos docker-compose).

{% highlight yaml linenos %}
version: "3.3"
services:
   web:
      build:
         context: ../../
         dockerfile: ./Dockerfile
      ports:
         - "8080:8080"
      networks:
         - overlay
      volumes:
         - testsresults:/test
networks:
   overlay:
volumes:
   testsresults:
      driver: local
      driver_opts:
         type: none
         device: ${PWD}/dist/test
         o: bind
{% endhighlight %}

**5. Azure Devops pipeline:**

Como primer paso de la pipeline, deberemos crear en el host la carpeta donde el volumen de Docker nos generará el resultado de los tests:

![create tests results folder task](/assets/img/tests_docker_1.png){: .mx-auto.d-block :}

Después construiremos la imagen de nuestro contenedor, poniendo especial atención en establecer la variable de entorno PWD correctamente (apuntando al directorio principal del proyecto):

![build docker image task](/assets/img/tests_docker_2.png){: .mx-auto.d-block :}

Una vez generada la imagen del contenedor, lo levantaremos con el comando up y en modo detached (-d), ya que en nuestro caso real ejecutamos en el entrypoint un servidor node express para exponer la SPA y de no hacerlo así, el servidor se quedaría escuchando y el comando nunca terminaría.

Cabe destacar, que el volumen es montado y los resultados de los tests son creados exactamente en este paso, si solo construyésemos la imagen no generaríamos ningún archivo.

![start container task](/assets/img/tests_docker_3.png){: .mx-auto.d-block :}

Por último, publicamos el resultado de los tests desde la ruta correspondiente del host:

![publish test result task](/assets/img/tests_docker_4.png){: .mx-auto.d-block :}

¡Y voilá! Cuando ejecutemos el pipeline, ya tendremos el informe del resultado de los tests publicado:

![tests report](/assets/img/tests_docker_5.png){: .mx-auto.d-block :}

**6. Ejecución en local:**

Si como en nuestro caso, el sistema operativo usado en vuestro entorno de desarrollo local es Windows, deberéis establecer primero el valor de la variable de entorno **PWD**, puesto que esta variable sólo existe en Linux. Bastará un batch script parecido a este para configurar la variable y ejecutar docker-compose:

{% highlight batch linenos %}
echo off
SETLOCAL EnableExtensions EnableDelayedExpansion
 
call :SET_PWD
rmdir /s /q dist
mkdir dist\test
docker-compose -f ./docker-compose.yml up --build --force-recreate
 
:SET_PWD</div>
   set_cd_with_slashes=!cd:\=/!
   set_cd_without_colon=!_cd_with_slashes::=!
   set_cd_no_spaces=!_cd_without_colon:=!
   set PWD=!_cd_no_spaces!
{% endhighlight %}

Espero que os resulte útil este artículo y si tenéis cualquier duda o alguna propuesta para mejorar el proceso, ¡no dudéis en poneros en contacto conmigo! 🙂