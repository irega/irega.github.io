---
layout: post
title: Como obtener los índices de los elementos de un array con LINQ 
tags: [C#]
---

El otro día se me presentó un problema en el proyecto en el que estoy trabajando actualmente. Tenía un array o lista de valores boolean de la forma [true, true, false, true, false, …] que usaba para recordar si una fila determinada de un grid se encontraba activada o no. Por lo tanto, una fila con índice “i” estaba activada si array[i] = true.

Hasta ahí todo muy fácil, pero necesitaba hacer una consulta sobre el array para saber que filas estaban activadas. Para realizar la consulta como es lógico necesitaba utilizar LINQ, y no era viable hacerme un array de objetos de una clase propia elaborada por mí del tipo [índice, valor]. Así que busqué un rato por Google y al final dí con la solución, de tal forma que cuando hago una consulta sobre un array con LINQ y realizo un filtrado, puedo saber en todo momento que índice tiene cada elemento resultante de dicha consulta. Os pego aquí el ejemplo:

{% highlight csharp linenos %}
var query = array.Select((elemento, indice) => new
{
   Elemento = elemento,
   Indice = indice
}).Where(elem => elem.Elemento == true).Select( elem => elem.Indice);
{% endhighlight %}

Con esto tenemos la lista de índices de los elementos del array que tienen valor true.