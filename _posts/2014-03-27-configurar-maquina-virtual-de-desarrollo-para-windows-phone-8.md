---
layout: post
title: Configurar máquina virtual de desarrollo para Windows Phone 8
tags: [Windows Phone]
---

Para desarrollar nuestras aplicaciones para Windows Phone 8, necesitaremos un teléfono con dicho sistema para probarlas. En caso contrario, tenemos la opción de utilizar el emulador que viene incluido en el SDK correspondiente:

[http://developer.windowsphone.com/en-us/downloadsdk](http://developer.windowsphone.com/en-us/downloadsdk)

Los requisitos para ejecutar dicho emulador son los siguientes:

[http://msdn.microsoft.com/en-us/library/windowsphone/develop/ff626524(v=vs.105).aspx](http://msdn.microsoft.com/en-us/library/windowsphone/develop/ff626524(v=vs.105).aspx)

Sin embargo, si soléis montar el entorno de desarrollo en máquinas virtuales como yo, seguramente os topéis con algún que otro problema a la hora de configurarlo. Por ejemplo, yo siempre he utilizado para montar mis máquinas virtuales la aplicación [VirtualBox](https://www.virtualbox.org/wiki/Downloads) de Oracle. A pesar de cumplir los requisitos para el emulador, cuando intenté instalar el SDK me apareció un error indicándome lo contrario.

Empecé a buscar un poco por Google y leí en unos cuantos sitios que al parecer VirtualBox no es capaz de leer las características de virtualización del procesador correctamente, por lo que la mayoría de la gente usaba [VMWare](https://my.vmware.com/web/vmware/free#desktop_end_user_computing/vmware_player/6_0). A pesar de ello, tuve que abrir el archivo de configuración de la máquina virtual para conseguir que se ejecutara correctamente el emulador. Para ello os dejo los dos enlaces que seguí en su momento:

[http://blog.dataart.com/how-to-launch-windows-phone-8-emulator-on-virtual-machine/](http://blog.dataart.com/how-to-launch-windows-phone-8-emulator-on-virtual-machine/)
[http://geertvanhorrik.com/2012/10/31/running-the-windows-phone-8-emulator-in-a-virtual-machine](http://geertvanhorrik.com/2012/10/31/running-the-windows-phone-8-emulator-in-a-virtual-machine)