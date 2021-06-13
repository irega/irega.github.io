---
layout: post
title: Añadiendo cobertura de código a la build de tests de Frontend (Chutzpah + TFS 2017)
tags: [DevOps]
---

Tomando como base la build que hemos creado en mi [anterior post]({% post_url 2018-02-24-configurando-una-build-de-tests-de-frontend-con-chutzpah-y-tfs-2017 %}), vamos a ver como añadir un informe de cobertura de código generado por el propio Chutzpah.

Para ello, lo primero que deberemos modificar es el archivo de configuración “chutzpah.json” de nuestro proyecto web:

{% highlight json linenos %}
{
  "Server": {
    "Enabled": true
  },
  "CodeCoverageExecutionMode": "Always",
  "CodeCoverageIgnores": [
    "node_modules/*",
    "*.Spec.js",
  ],
  "Transforms": [
    {
      "Name": "jacoco",
      "Path": "..\\..\\..\\TestResults\\ChutzpahJacoco.xml"
    },
    {
      "Name": "coveragehtml",
      "Path": "..\\..\\..\\TestResults\\ChutzpahJS.html"
    }
  ]
}
{% endhighlight %}

A continuación comento las nuevas propiedades añadidas al archivo:

- **Server**: Activando esta opción, chutzpah cargará el html, los archivos Javascript y el resto de contenido desde un servidor web que crea previamente él mismo. Lo activamos porque algunos navegadores como Chrome, muestra errores de [CORS](https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS) al intentar cargar los archivos por protocolo file://

- **CodeCoverageExecutionMode**: Establecemos la propiedad con el valor “Always” para que siempre se ejecuten los tests con cobertura de código.

- **CodeCoverageIgnores**: Indicamos en un array la lista de paths o globs que deben ser ignorados en el informe de cobertura de código. Empecé utilizando la propiedad “CodeCoverageExcludes”, pero en ciertas ocasiones, los tests se ven impactados y empiezan a fallar porque no se cargan las dependencias correctamente.En nuestro caso hemos obviado los módulos externos instalados por npm (node_modules) y los archivos de los propios tests (*.Spec.js).

- **Transforms**: Indicaremos un array con las transformaciones necesarias. Estas transformaciones no son más que conversiones de los resultados de los tests en diferentes formatos.En nuestro caso vamos a generar un .xml en formato jacoco para que la build de TFS pueda interpretar los resultados de la cobertura de código y un .html con el informe de cobertura en formato más amigable para el usuario que quiera descargarlo al finalizar la build. En ambos casos hay que indicar la ruta del servidor de build donde queremos que se generen los archivos.

Ahora vamos  a modificar la definición de nuestra build para que se alimente de los dos archivos generados por Chutzpah. Añadimos al final un paso de tipo **Publish code coverage**:

![Publish test coverage task](/assets/img/tfs_2017_publish_test_coverage.png){: .mx-auto.d-block :}

Podremos hacer referencia al directorio donde le hemos indicado a Chutzpah que genere los archivos mediante la variable **$(Common.TestResultsDirectory)**.

En la propiedad **“Code Coverage Tool”** indicaremos “JaCoCo”, mientras que en **“SummaryFile”** indicaremos la ruta donde se encuentra nuestro archivo en dicho formato. En **“Report Directory”** indicaremos el directorio principal de resultados de los tests, para que la build añada como adjuntos los archivos que contiene (sobretodo el informe en formato HTML).

Si queréis obtener los resultados de cobertura a pesar de que los tests fallen, recordad seleccionar la opción correcta en **Run this task**:

![Run even the task failed](/assets/img/tfs_2017_run_task_failed.png){: .mx-auto.d-block :}

Si lanzamos una nueva ejecución de la build, apreciaremos que ya tenemos resultado de cobertura de código y además podemos descargarnos los adjuntos para consultar el informe de cobertura en un formato más amigable:

![Build test coverage report](/assets/img/tfs_2017_test_coverage_report.png){: .mx-auto.d-block :}