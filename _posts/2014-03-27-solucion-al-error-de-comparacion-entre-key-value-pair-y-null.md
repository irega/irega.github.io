---
layout: post
title: Solución al error de comparación entre KeyValuePair y null
tags: [C#]
---


Después de bastante tiempo sin escribir, voy a intentar al menos dejaros una pequeña aportación. Hace unos días se me presentó el siguiente error de compilación en el proyecto:

{: .box-error}
Operator ‘!=’ cannot be applied to operands of type ‘System.Collections.Generic.KeyValuePair<string,string>’ and ‘<null>’

En mi caso, hacía una búsqueda con LINQ sobre una lista de elementos del tipo *KeyValuePair<string, string>* y tenía una variable de dicho tipo que tomaba el valor resultante por el método *FirstOrDefault()* de la siguiente manera:

{% highlight csharp linenos %}
KeyValuePair<string, string> element = list.Where(pair => pair.Key == "valor_a_buscar").FirstOrDefault();
{% endhighlight %}

Por tanto, para saber si hay algún elemento en la lista que cumple la condición debía comprobar si la variable element tomaba el valor *null* o no. Como el operador de igualdad no está implementado en tipos *KeyValuePair*, tuve que sustituir la anterior línea de código por la siguiente:

{% highlight csharp linenos %}
KeyValuePair<string, string>? element = list.Where(pair => pair.Key == "valor_a_buscar").FirstOrDefault();
{% endhighlight %}

Con esto, lo que hacemos es usar el tipo **nullable** de *KeyValuePair*, por tanto para saber si la variable es *null* o no, nos vale con comprobar la variable binaria de la variable element **HasValue**. Si *HasValue* es *true* significa que la variable no es *null*, en caso contrario sí lo es.