---
layout: post
title: Principios de diseño (2)
subtitle: Duplication of knowledge about topology
tags: [Software design]
---

¡Vamos a por el segundo capítulo! Esta vez hablaremos sobre:

{: .box-note}
Duplication of knowledge about topology

Como en el anterior capítulo, todo lo que escriba basado en el libro de Corey Haines estará basado en sus ejemplos sobre el [Juego de la Vida de Conway](https://es.wikipedia.org/wiki/Juego_de_la_vida).

En el libro se empieza a implementar la base del sistema, definiendo un objeto “world” que contiene una serie de celdas vivas y muertas. Desde este objeto “world” se puede establecer una celda viva en cierta localización (x, y). También se puede comprobar si una celda está viva.

Vamos a ver el código original del ejemplo donde se implementa esto, a continuación veremos el código refactorizado y por último comentaremos las conclusiones.

{% highlight ruby linenos %}
class World
  def set_living_at(x, y)
    #...
  end
  def alive_at?(x, y)
    #...
  end
end
 
class LivingCell
  attr_reader :x, :y
end
class DeadCell
  attr_reader :x, :y
end
{% endhighlight %}

Refactorizado:

{% highlight ruby linenos %}
class Location
  attr_reader :x, :y
end
 
class World
  def set_living_at(location)
    #...
  end
  def alive_at?(location)
    #...
  end
end
 
class LivingCell
  attr_reader :location
end
class DeadCell
  attr_reader :location
end
{% endhighlight %}

¿Qué es lo que hemos hecho en la refactorización? Se ha creado una nueva abstracción “Location”, persiguiendo dos objetivos principales:

- **Eliminar la duplicidad de conocimiento sobre topología**: En el código original se utilizaban directamente las coordenadas (x, y) en varias partes del código fuera del ámbito de una localización. Es decir, tenían conocimiento de la topología/estructura de una localización.

¿Qué pasaría si se cambia en el futuro su topología y añadimos una nueva coordenada (por ejemplo z)? **Tendríamos que modificar todos los usos**.

- **Solucionar problemas con el naming**: En todas las partes donde se trabajaba con las coordenadas, se tenían que usar dos variables con un nombre no muy recomendable y poco legible (x, y). Creando la nueva abstracción “Location” solucionamos este problema de nomenclatura.

¡Hasta el siguiente capítulo!