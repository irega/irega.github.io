---
layout: post
title: URL’s amigables en MOSS 2007
tags: [Sharepoint]
--- 

En la mayoría de las ocasiones, cuando creamos nuestro sitio web, necesitamos que sea accesible mediante [URL's semánticas o amigables](http://es.wikipedia.org/wiki/URL_sem%C3%A1ntica) (por ejemplo para mejorar el posicionamiento de éste en los buscadores). Esta tarea puede resultar un poco complicada cuando tenemos implementado nuestro sitio sobre MOSS 2007. En este pequeño artículo, voy a dar a conocer una serie de alternativas para llevar a cabo dicha tarea.

Más adelante, cuando mi tiempo me lo permita, escribiré un manual paso a paso de la instalación y configuración de la que para mí es la opción más completa y personalizable (aunque puede que no la más intuitiva-fácil): **IIS URL Rewrite**. Ahí va la lista:

- **Feature "Semantics URLs" para MOSS 2007** ([http://blog.mastykarz.nl/semantic-urls-in-moss-2007-imtech-sharepoint-semantic-urls-free-feature](http://blog.mastykarz.nl/semantic-urls-in-moss-2007-imtech-sharepoint-semantic-urls-free-feature)):

Se trata de una característica que se puede instalar y activar en cualquier portal MOSS 2007. La propia “feature” realiza una construcción automática de un diccionario de traducción de direcciones a partir de las páginas existentes en el portal. A medida que se van introduciendo y solicitando páginas se va actualizando dicha lista (se puede forzar la actualización desde la página de configuración). A partir de este diccionario, el portal redirecciona automáticamente las direcciones amigables solicitadas por los navegadores a sus correspondientes direcciones reales. Aunque es la **opción más fácil** de implementar, tiene una pega bastante importante, **no se puede personalizar** el formato de las direcciones ni tampoco qué páginas deben incluirse en el diccionario comentado anteriormente.

- **Implementación de un HttpModule** ([http://blogs.perficient.com/microsoft/2010/04/implement-friendly-urls-for-sharepoint-blog-sites](http://blogs.perficient.com/microsoft/2010/04/implement-friendly-urls-for-sharepoint-blog-sites)):

Esta opción se basa en implementar una librería en .NET que será referenciada en el web.config del portal MOSS. Esta librería actúa por encima de MOSS cada vez que se solicita una dirección, de tal forma que se puede redireccionar o reescribir la dirección a otra completamente diferente. Esta opción es **la más personalizable**, pero a cambio necesita mucho más esfuerzo y **la implementación es mucho más costosa**.

- **Servidor REST** ([http://community.bamboosolutions.com/blogs/mashpoint/archive/2008/12/17/todo-introducing-mashpoint-tm-rest-api-for-sharepoint.aspx](http://community.bamboosolutions.com/blogs/mashpoint/archive/2008/12/17/todo-introducing-mashpoint-tm-rest-api-for-sharepoint.aspx) y [http://blogs.msdn.com/b/sharepointdesigner/archive/2008/12/05/creating-restful-mashups-using-spd-2007-part-1.aspx](http://blogs.msdn.com/b/sharepointdesigner/archive/2008/12/05/creating-restful-mashups-using-spd-2007-part-1.aspx)):

Existe un tipo de servicio web llamado REST, donde una de sus múltiples características es casualmente la reescritura de ciertas direcciones web para hacerlas amigables. Existen librerías y métodos para implementarlo a nivel de MOSS, tal y como se detalla en los dos enlaces nombrados anteriormente. Sin embargo, como hemos dicho tiene muchas más características y **su implementación sería también muy costosa**, sin tener en cuenta que **seguramente la librería a utilizar es de pago**.

- **IIS URL Rewrite** ([http://srirajc.blogspot.com.es/2011/06/writing-seo-friendly-urls-in-sharepoint.html](http://srirajc.blogspot.com.es/2011/06/writing-seo-friendly-urls-in-sharepoint.html)):

Una extensión para servidores IIS 7.0. Como he dicho al principio de la entrada, en mi opinión está es **la opción más completa**, ya que es suficientemente personalizable (podemos crear un diccionario de direcciones) y siguiendo el tutorial del enlace anterior se puede implementar rápidamente. Espero que en un periodo corto de tiempo pueda compartir con vosotros un ejemplo de implementación completo que he realizado, puesto que en el blog de referencia hay algunas cosas importantes a mi modo de ver que no se explican.

- **Otras opciones** ([http://surpoint.blogspot.com.es/2012/06/articulos-interesantes-sobre-urls.html](http://surpoint.blogspot.com.es/2012/06/articulos-interesantes-sobre-urls.html)):

En el anterior enlace se muestra una lista de otras posibles opciones y “features” de MOSS para implementar URLs amigables, aunque no he llegado a profundizar sobre ellas.