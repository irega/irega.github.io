---
layout: post
title: Habilitar conexiones remotas en SQL Server 2008
tags: [SQL Server]
comments: true
---

Seguramente, alguna vez cuando habéis desarrollado una aplicación web en ASP .NET os ha salido este mensaje al ejecutarla:

{: .box-error}
Error relacionado con la red o específico de la instancia mientras se establecía una conexión con el servidor SQL Server. No se encontró el servidor o éste no estaba accesible. Compruebe que el nombre de la instancia es correcto y que SQL Server está configurado para admitir conexiones remotas. (provider: Interfaces de red SQL, error: 26 – Error al buscar el servidor o instancia especificado)

La mayoría de las veces este error se debe a que no hemos habilitado las conexiones remotas de la instancia de SQL Server. En esta entrada vamos a explicar brevemente como podéis hacerlo con **SQL Server 2008 R2 Developer Edition y Windows 7 Ultimate**:

1- Primero ejecutáis desde el menú inicio **"SQL Server Configuration Manager"**:

![SQL startup menu](/assets/img/sql_startup_menu.png){: .mx-auto.d-block :}

2- Ahora debéis desplegar "SQL Server Network Configuration" y seleccionar "Protocols for MSSQLSERVER". Os aparecerá una lista de protocolos y su estado actual, debéis activar **"Named Pipes"** y **"TCP/IP"** haciendo click con el botón derecho del ratón y seleccionando "Enable":

![SQL network configuration](/assets/img/sql_network_interfaces.png){: .mx-auto.d-block :}

3- Además, debemos **configurar el puerto** por el cual nos conectaremos por el protocolo “TCP/IP”. Para ello, volvemos a hacer click con el botón derecho en el protocolo y seleccionamos **"Propiedades"**. Configuramos el puerto que queramos en el recuadro rojo que se muestra en la imagen:

![SQL TCP properties](/assets/img/sql_tcp.png){: .mx-auto.d-block :}

4- Sólo nos quedan dos pequeños pasos. Primero, reiniciamos el servicio de SQL Server para que tome los cambios que hemos efectuado. Para ello nos vamos a Panel de control -> Herramientras administrativas -> Servicios y buscamos el servicio de SQL Server. Pulsamos con el botón derecho del ratón y seleccionamos **"Reiniciar"**:

![reset SQL service](/assets/img/sql_service.png){: .mx-auto.d-block :}

5- Con esto tenemos ya configurado SQL Server, ahora debemos configurar nuestro sistema para que los puertos necesarios estén abiertos. Si hemos elegido como puerto el que se muestra en la imagen (**1433**), debemos abrir en nuestro firewall ese puerto como **TCP** y el **1434** como **UDP**. En mi caso, y supongo que el de la mayoría, como tengo el **firewall de Windows** únicamente, basta con añadir una excepción para el programa SQL Server. Para ello, vamos a Panel de control -> Firewall de Windows. En la pantalla que nos aparece, seleccionamos la opción que se muestra en la imagen:

![SQL Windows firewall config](/assets/img/sql_firewall_windows.png){: .mx-auto.d-block :}

Y pulsamos en la pantalla que se muestra después en **"Permitir otro programa…"** para añadir nuestro SQL Server como excepción. Dependiendo la edición que tengamos de SQL Server la ruta donde tenemos que buscar el ejecutable estará en un sitio o en otro, pero será muy parecida a la que os digo a continuación. En mi caso la ruta es:

*C:\Archivos de programa\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\Binn\sqlservr.exe*

Con esto, deberíamos haber solucionado el problema 😉