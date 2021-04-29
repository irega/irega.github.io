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