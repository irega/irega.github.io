---
layout: post
title: Añadiendo informe de cobertura de los tests ejecutados dentro de un contenedor Docker
subtitle: Karma+Angular+Azure DevOps
thumbnail-img: /assets/img/cobertura_docker.gif
tags: [DevOps]
---

Después de [publicar el informe del resultado de los tests]({% post_url 2019-07-06-publicando-el resultado-de-los-tests-ejecutados-dentro-de-un-contenedor-de-docker %}), en la siguiente iteración conseguimos añadir la cobertura de código a dicho informe. Para ello, lo primero que extendimos es la **configuración del test runner “Karma”** para añadir el plugin adecuado:

{% highlight json linenos %}
[...]
plugins: [
   [...]
   require('karma-coverage-istanbul-reporter')
],
coverageIstanbulReporter: {
    reports: ['html', 'lcov', 'cobertura'],
    fixWebpackSourcePaths: true
}
{% endhighlight %}

Además, tendremos que modificar el **package.json** para instalar el plugin de karma:

{% highlight json linenos %}
[...]
"devDependencies": {
   [...]
   "karma-coverage-istanbul-reporter": "^1.2.1"
}
{% endhighlight %}

Y añadir el parámetro **--code-coverage** al script npm de que ejecuta los tests:

{% highlight json linenos %}
[...]
"scripts": {
   "test": "ng test --code-coverage -sm=false --config ./karma.conf.js"
   [...]
}
{% endhighlight %}

Cuando se ejecuten los tests dentro de nuestro contenedor Docker, tendremos que copiar también la carpeta que genera el plugin de Karma (coverage) al path de salida de nuestros tests, donde previamente hemos montado el volumen. Modificamos nuestro **Dockerfile**:

{% highlight docker linenos %}
[...]
COPY --from=build /build/coverage ./coverage
[...]
{% endhighlight %}

Dentro del pipeline de **Azure DevOps**, deberemos añadir la task correspondiente para publicar el informe de cobertura, simplemente referenciando el path donde se han generado los archivos en el paso anterior (dist/test/coverage):

![Publish code coverage task](/assets/img/publish_code_coverage.png){: .mx-auto.d-block :}

Como podéis observar, tuvimos que ejecutar un script antes de la tarea de publicación, porque el archivo principal que contiene la información de la cobertura (**cobertura-coverage.xml**), referencia a los distintos ficheros de código a partir de una ruta principal, desde la que luego monta las rutas relativas:

![Cobertura coverage XML file](/assets/img/cobertura_xml.png){: .mx-auto.d-block :}

Como hemos ejecutado los tests dentro un contenedor Docker, la ruta que genera es errónea (/build), y tenemos que modificarla dentro de este archivo mediante un script bash para que apunte al directorio donde realmente tenemos nuestos ficheros de código:

{% highlight bash linenos %}
currentPathEscapingSlashes=${PWD//'/'/'\/'}
sudo sed -i "s/\/build/${currentPathEscapingSlashes}/g" dist/test/coverage/cobertura-coverage.xml
{% endhighlight %}

En el script partimos de la ruta actual mediante la variable PWD, por lo que es importante especificar el path desde el que ejecutamos el script.

Y después de todo este proceso, por fin podremos visualizar el informe de cobertura:

![Code coverage report](/assets/img/code_coverage_report.png){: .mx-auto.d-block :}