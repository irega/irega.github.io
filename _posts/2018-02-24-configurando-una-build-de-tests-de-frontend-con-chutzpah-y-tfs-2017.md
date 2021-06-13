---
layout: post
title: Configurando una build de tests de Frontend con Chutzpah y TFS 2017
tags: [JavaScript, DevOps]
---

Aunque a día de hoy es más habitual utilizar “test runners” como **Karma**, en proyectos más antiguos con código “legacy” que hacen uso de tecnologías Microsoft es habitual encontrarnos con **Chutzpah** como framework encargado para ejecutar los tests del Frontend de nuestra aplicación.

En tiempo de desarrollo se suelen ejecutar estos tests desde el propio Visual Studio o con un script de npm, utilizando en ambos casos los **plugins** correspondientes de Chutzpah (para gulp o Visual Studio).

Pero, ¿y si queremos que estos tests se ejecuten automáticamente en otro momento? Por ejemplo al desplegar nuestra aplicación o antes de realizar una integración de código sobre una rama (branch). En ambas situaciones, se ejecuta una **build** que podremos extender con una serie de pasos en los que se ejecuten nuestros tests de Frontend.

A continuación, os detallo **paso a paso** como crear dicha build, la cual podréis extender con más tareas, así como programar su periodicidad de ejecución para cubrir completamente vuestras necesidades:

1- Deberemos instalar en nuestro proyecto web el paquete NuGet de Chutzpah. En este tutorial trabajaremos sobre la versión 4.3.6.

2- Accederemos a la sección **Builds**:

![TFS 2017 Builds section](/assets/img/tfs_2017_builds.png){: .mx-auto.d-block :}

3- Pulsaremos el botón correspondiente para crear una nueva build:

![New TFS build button](/assets/img/tfs_2017_new_build.png){: .mx-auto.d-block :}

4- Seleccionaremos una plantilla **vacía**:

![TFS build empty template](/assets/img/tfs_2017_empty_template.png){: .mx-auto.d-block :}

5- Necesitaremos 4 tareas que explicaremos en los siguientes pasos. Estas tareas las iremos añadiendo una a una mediante el botón **Add Task**:

![Add task to TFS build](/assets/img/tfs_2017_empty_add_task.png){: .mx-auto.d-block :}

6- La primera tarea será **Get sources**. En dicha tarea se descargarán todos los archivos necesarios para la build desde nuestro repositorio de código fuente. Deberemos eliminar el mapeo de tipo Cloack y dejaremos solamente el de tipo Map apuntando a la ruta donde se encuentre nuestra solución:

![Get sources task](/assets/img/tfs_2017_get_sources.png){: .mx-auto.d-block :}

7- Siguiente tarea: **NuGet restore**. Deberemos configurar únicamente el path de nuestra solución. Con ello conseguimos que se instale el paquete NuGet de Chutzpah que indicamos en el paso 1.

![NuGet restore task](/assets/img/tfs_2017_nuget_restore.png){: .mx-auto.d-block :}

8- **npm install**. En nuestro caso, los tests tienen dependencias con código que se encuentra en paquetes npm, por tanto, debemos ejecutar el comando “npm install” sobre la ruta de nuestro proyecto web para que se instalen todas las dependencias definidas en el archivo “package.json”. Dicha ruta la configuramos en el campo **working folder**:

![npm install task](/assets/img/tfs_2017_npm_install_task.png){: .mx-auto.d-block :}

9- Configuramos finalmente la tarea VsTest que ejecutará los tests con Chutzpah. Para ello, deberemos configurar los campos **Search folder y Test assemblies**. En Test assemblies indicaremos la ruta de nuestro archivo “chutzpah.json”. Esta ruta será relativa sobre la ruta indicada en Search folder, que en nuestro caso será la ruta principal donde se ha descargado todo el código: la variable $(Build.SourcesDirectory).

En el archivo **“chutzpah.json”** deberemos definir toda la configuración que consideremos para nuestros tests, pero sobre todo deberemos establecer la propiedad Tests para indicarle a Chutzpah que archivos de tests deben ejecutarse.

![Chutzpah task](/assets/img/tfs_2017_chutzpah_task.png){: .mx-auto.d-block :}

10- Tenemos que acordarnos de configurar también el campo **“Path to custom test adapters”**, pues será el que utilizará la build para localizar las librerías de Chutzpah necesarias para la integración de los tests con TFS. Estas librerías se encuentran en la ruta donde se ha instalado el paquete NuGet.

![Configure custom test adapters](/assets/img/tfs_2017_path_test_adapters.png){: .mx-auto.d-block :}

11- Una vez guardemos los cambios y ejecutemos nuestra build, veremos una estadística completa de los tests ejecutados, así como los errores detallados en caso de que los hubiera:

![Build execution with tests report](/assets/img/tfs_2017_build_execution.png){: .mx-auto.d-block :}