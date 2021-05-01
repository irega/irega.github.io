---
layout: post
title: IIS URL Rewrite 
subtitle: Instalación y configuración
tags: [Sharepoint]
---

Como comenté en la anterior publicación, para mí la opción más completa para implementar un sistema de URL’s amigables en un portal MOSS 2007 es el módulo IIS URL Rewrite. Para la instalación y configuración del módulo se ha tomado el siguiente enlace como referencia:

[http://srirajc.blogspot.com.es/2011/06/writing-seo-friendly-urls-in-sharepoint.html](http://srirajc.blogspot.com.es/2011/06/writing-seo-friendly-urls-in-sharepoint.html)

En él, se describe perfectamente los pasos a seguir para una primera implementación del módulo, alojando el diccionario de direcciones en base de datos. Sin embargo, hay alguna errata y por ello paso a explicar cada paso nuevamente:

**1. INSTALACIÓN**

Para el correcto funcionamiento del módulo se deben instalar los dos siguientes componentes en el servidor (se asume que previamente está instalado IIS):
- [http://www.iis.net/download/urlrewrite](http://www.iis.net/download/urlrewrite)
- [http://archive.msdn.microsoft.com/Project/Download/FileDownload.aspx?ProjectName=rewriteextensibility&DownloadId=9257](http://archive.msdn.microsoft.com/Project/Download/FileDownload.aspx?ProjectName=rewriteextensibility&DownloadId=9257)

El primer enlace es realmente el módulo URL Rewrite, pero se debe instalar después de éste el segundo enlace, ya que contiene las librerías y componentes necesarios para hacer uso de los proveedores. Un proveedor en este contexto es el componente al que se conectará el servidor web para traducir cada dirección virtual solicitada. Aunque el proveedor que vamos a utilizar en este ejemplo es el de base de datos, también se puede usar otros para alojar el diccionario en otro sitio, como por ejemplo en un archivo de texto físico del servidor

Hay que tener en cuenta que la instalación del segundo paquete hay que realizarla como “instalación personalizada” y seleccionar la opción “Runtime” para que registre en la GAC los ejemplos de proveedores.

**2. CONFIGURACIÓN DE BASE DE DATOS**

Como en nuestro caso se va a usar el proveedor de base de
datos y se almacenará en una tabla el diccionario de direcciones, es necesario crear dos procedimientos almacenados.

Uno de los procedimientos almacenados se llamará
automáticamente cada vez que se realice la petición de una dirección virtual, buscará en la tabla donde está almacenado el diccionario dicha dirección y obtendrá la dirección real a la que tiene que redirigir.

El otro procedimiento realizará el método inverso, a partir de una dirección real a la que se ha redirigido, obtendrá del diccionario la dirección virtual para reescribirla en la barra de direcciones del navegador del usuario.

Se han creado mediante los siguientes scripts los dos procedimientos almacenados en nuestra base de datos, consultando el diccionario desde nuestra tabla “MapeoUri”:

{% highlight sql linenos %}
CREATE PROCEDURE [dbo].[GetRewrittenUrl]
@input nvarchar(256)
AS
 
SELECT rt.UriReal
FROM dbo.MapeoUri rt
WHERE rt.UriVirtual = @input
 
CREATE PROCEDURE [dbo].[GetRedirectedUrl]
@input nvarchar(256)
AS
 
SELECT rt.UriVirtual
FROM dbo.MapeoUri rt
WHERE rt.UriReal = @input
{% endhighlight %}

Además, el usuario y la contraseña con los que se tienen que ejecutar ambos procedimientos los estableceremos en la propia cadena de conexión. Si no se quiere que dichos datos aparezcan ahí por seguridad, se tendría que dar de alta en base de datos el usuario del pool de aplicaciones sobre el que se ejecuta la aplicación o el portal donde se ha activado el módulo URL Rewrite:

{% highlight sql linenos %}
USE [master]
CREATE LOGIN [IIS APPPOOL\DefaultAppPool] FROM WINDOWS WITH DEFAULT_DATABASE=[master]
{% endhighlight %}

Si se crea el usuario en base de datos se tiene que tener en cuenta que dicho usuario debe tener permisos sobre la base de datos que almacena el diccionario, sobre todo de ejecución de procedimientos almacenados.

A la hora de rellenar la tabla del diccionario de direcciones hay que tener en cuenta que las direcciones que se introduzcan corresponden con la parte derecha de la dirección URL completa a partir del punto en el que se ha implementado el módulo.

A la hora de rellenar la tabla del diccionario de direcciones hay que tener en cuenta que las direcciones que se introduzcan corresponden con la parte derecha de la dirección URL completa a partir del punto en el que se ha implementado el módulo.

Por ejemplo, si como se explica más adelante en la sección “Configuración básica de IIS” se configura el módulo a partir de una aplicación web/portal MOSS y su URL de acceso principal es [http://www.miportalsp.com](http://www.miportalsp.com), una dirección virtual completa como [http://www.miportalsp.com/es-ES/direccion-de-prueba](http://www.miportalsp.com/es-ES/direccion-de-prueba) se tendría que introducir en el campo de dirección virtual con el valor “es-ES/direccion-de-prueba”. Y lo mismo con para su dirección real en el campo adecuado (por ejemplo “es-ES/direccionDePrueba.aspx”).

**3. CONFIGURACIÓN BÁSICA DE IIS**

En el enlace de referencia que se ha comentado anteriormente, usa la interfaz del IIS Manager para configurar el módulo y sus reglas, pero en nuestro caso se ha partido del ejemplo que se propone para modificar directamente el archivo “web.config” del portal. Toda modificación que se haga en el “web.config”, en la sección **&lt;configuration>/&lt;system.webServer>/&lt;rewrite>** se verá reflejada directamente en el módulo de IIS.

Aun así, pasamos a mostrar por encima las pantallas de configuración del módulo:

1- Primero se selecciona en el panel izquierdo la aplicación web donde se quiere activar el módulo.
2- Una vez seleccionada, aparecerán las opciones disponibles para dicha aplicación en el panel de la derecha. Entramos en la configuración del módulo:

![IIS URL Rewrite module config](/assets/img/iis_url_rewrite_module_config.jpg){: .mx-auto.d-block :}

3- En la siguiente pantalla, aparecerán los listados de reglas. El que nos interesa es el listado superior de reglas de entrada a aplicar en la URL solicitada:

![IIS URL Rewrite rules](/assets/img/iis_rewrite_rules.jpg){: .mx-auto.d-block :}

4- Para añadir una regla se puede usar el panel de acciones de la derecha:

![IIS URL Rewrite add new rule](/assets/img/iis_rewrite_input_add_rule.jpg){: .mx-auto.d-block :}

5- Con lo que aparecerá una ventana donde se podrán seleccionar diferentes plantillas que nos ayudarán a crear la regla. Si se quiere tener total libertad para el formato de la regla, se deberá seleccionar la plantilla “Regla en blanco” para personalizar la regla mediante expresiones regulares. Si queremos una conversión de “friendly url” rápida y fácil se podrá seleccionar la plantilla “Dirección URL descriptiva”:

![IIS URL Rewrite add new rule dialog](/assets/img/iis_rewrite_input_add_rule_dialog.jpg){: .mx-auto.d-block :}

Aunque como hemos dicho anteriormente, en nuestro caso se ha modificado directamente el “web.config” del portal, añadiendo las siguientes líneas en la sección **&lt;configuration>/&lt;system.webServer>**:

{% highlight xml linenos %}
<rewrite>
      <providers>
        <provider name="DB" type="DbProvider, Microsoft.Web.Iis.Rewrite.Providers, Version=7.1.761.0, Culture=neutral, PublicKeyToken=0545b0627da60a5f">
          <settings>
            <add key="ConnectionString" value="X" />
            <add key="StoredProcedure" value="GetRewrittenUrl" />
            <add key="CacheMinutesInterval" value="0" />
          </settings>
        </provider>
        <provider name="DB2" type="DbProvider, Microsoft.Web.Iis.Rewrite.Providers, Version=7.1.761.0, Culture=neutral, PublicKeyToken=0545b0627da60a5f">
          <settings>
            <add key="ConnectionString" value="X" />
            <add key="StoredProcedure" value="GetRedirectedUrl" />
            <add key="CacheMinutesInterval" value="0" />
          </settings>
        </provider>
      </providers>
      <rules>
        <clear />
        <rule name="DbProviderRedirect" enabled="true" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{DB2:{R:1}}" pattern="(.+)" />
          </conditions>
          <action type="Redirect" url="{C:1}" />
        </rule>
        <rule name="DbProviderRewrite" enabled="true" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{DB:{R:1}}" pattern="(.+)" />
          </conditions>
          <action type="Rewrite" url="{C:1}" />
        </rule>
      </rules>
    </rewrite>
{% endhighlight %}

En esas líneas existen dos partes bien diferenciadas: la definición de los proveedores (sección<providers>) y la definición de las reglas (sección <rules>).

Se han definido dos proveedores diferentes, uno para cada uno de los procedimientos almacenados. Además, en cada uno de ellos bajo la etiqueta <settings> se ha definido la cadena de conexión (sustituir “X” por el valor correcto). También se han definido dos reglas, cada una asociada a un proveedor.

**4. SOLUCIÓN A PROBLEMAS POSTERIORES**

Con el ejemplo propuesto en el enlace de referencia y haciendo las modificaciones anteriores en el “web.config” se consigue hacer funcionar el módulo en direcciones básicas **sin parámetros GET** concatenados.

Pero si por ejemplo en el diccionario se tiene como dirección real “es-ES/Paginas/paginaPrueba.aspx?idUsuario=47”, el módulo no es capaz de reescribir la dirección real a la virtual, puesto que a menos que se indique lo contrario, las reglas sólo analizan las direcciones URL sin los parámetros GET.

Para que funcione, se tendrá que modificar la regla de redirección especificada en el “web.config”, de tal manera que quede de la siguiente forma:

{% highlight xml linenos %}
<rule name="DbProviderRedirectQuery" enabled="true" stopProcessing="true">
<match url="(.*)" />
<conditions logicalGrouping="MatchAll" trackAllCaptures="false">
<add input="{DB2:{R:1}?{QUERY_STRING}}" pattern="(.+)" />
</conditions>
<action type="Redirect" url="{C:1}" appendQueryString="false" />
</rule>
{% endhighlight %}

De esta forma, incluyendo la variable {QUERY_STRING} en el filtro, se está especificando al módulo que busque la dirección completa en el diccionario. Además, se ha añadido el atributo appendQueryString=”false” en la acción de la regla. Este atributo sirve para especificar si el módulo debe anexar los parámetros GET de entrada a la dirección resultante.

En este caso, se está buscando una dirección real con parámetros GET, por tanto no se quiere que se anexen al final de la dirección resultante. Esto provoca otro problema, el caso en el que la dirección de entrada tiene parámetros GET, pero su dirección real en el diccionario no los tiene y sin embargo son necesarios en la dirección resultante. Para este caso se tendrían que anexar los parámetros al final de la traducción, por lo que se define una nueva regla en el archivo:

{% highlight xml linenos %}
<rule name="DbProviderRedirect" enabled="true" stopProcessing="true">
<match url="(.*)" />
<conditions logicalGrouping="MatchAll" trackAllCaptures="false">
<add input="{DB2:{R:1}}" pattern="(.+)" />
</conditions>
<action type="Redirect" url="{C:1}" appendQueryString="true" />
</rule>
{% endhighlight %}

Además, hay que quitar la variable {QUERY_STRING} en el filtro para que se analice la dirección sin la parte de parámetros.

Por último, se debe modificar la regla de reescritura para que anexe también los parámetros a la dirección:

{% highlight xml linenos %}
<rule name="DbProviderRewrite" enabled="true" stopProcessing="true">
<match url="(.*)" />
<conditions logicalGrouping="MatchAll" trackAllCaptures="false">
<add input="{DB:{R:1}}" pattern="(.+)" />
</conditions>
<action type="Rewrite" url="{C:1}" appendQueryString="true" />
</rule>
{% endhighlight %}


Ya que aunque la dirección sea virtual, la página puede necesitar los parámetros GET. La sección del archivo “web.config” completa quedaría del siguiente modo:

{% highlight xml linenos %}
<rewrite>
      <providers>
        <provider name="DB" type="DbProvider, Microsoft.Web.Iis.Rewrite.Providers, Version=7.1.761.0, Culture=neutral, PublicKeyToken=0545b0627da60a5f">
          <settings>
            <add key="ConnectionString" value="X" />
            <add key="StoredProcedure" value="GetRewrittenUrl" />
            <add key="CacheMinutesInterval" value="0" />
          </settings>
        </provider>
        <provider name="DB2" type="DbProvider, Microsoft.Web.Iis.Rewrite.Providers, Version=7.1.761.0, Culture=neutral, PublicKeyToken=0545b0627da60a5f">
          <settings>
            <add key="ConnectionString" value"X" />
            <add key="StoredProcedure" value="GetRedirectedUrl" />
            <add key="CacheMinutesInterval" value="0" />
          </settings>
        </provider>
      </providers>
      <rules>
        <clear />
        <rule name="DbProviderRedirectQuery" enabled="true" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{DB2:{R:1}?{QUERY_STRING}}" pattern="(.+)" />
          </conditions>
          <action type="Redirect" url="{C:1}" appendQueryString="false" />
        </rule>
        <rule name="DbProviderRedirect" enabled="true" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{DB2:{R:1}}" pattern="(.+)" />
          </conditions>
          <action type="Redirect" url="{C:1}" appendQueryString="true" />
        </rule>
        <rule name="DbProviderRewrite" enabled="true" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{DB:{R:1}}" pattern="(.+)" />
          </conditions>
          <action type="Rewrite" url="{C:1}" appendQueryString="true" />
        </rule>
      </rules>
    </rewrite>
{% endhighlight %}

Y eso es todo, espero que os sea útil esta aportación 🙂