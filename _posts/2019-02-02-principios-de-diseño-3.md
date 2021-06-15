---
layout: post
title: Principios de diseño (3)
subtitle: Behavior attractors
tags: [Software design]
---

Partiendo del código previo a la refactorización que hicimos en el anterior capítulo:

{% highlight ruby linenos %}
class World
  def set_living_at(x, y)
    #...
  end
  def alive_at?(x, y)
    #...
  end
end
class Cell
  attr_reader :x, :y
  def alive_in_next_generation?
    #...
  end
end
{% endhighlight %}

Nos encontramos con el reto de añadir una nueva funcionalidad a nuestro sistema, como es la obtención de las localizaciones de los vecinos a partir de otra localización:

{% highlight ruby linenos %}
def neighbors_of(x, y)
  # calculate the coordinates of neighbors
end
{% endhighlight %}

Aquí nos encontramos con una situación con la que os habréis encontrado multitud de veces, ¿donde deberíamos añadir esta nueva funcionalidad?

De primeras se nos pueden ocurrir dos alternativas, pero ambas tienen sus inconvenientes:

- **Cell**: Parece que añadir la funcionalidad a la celda sería lo más lógico, pero esta clase ya contiene la lógica para averiguar si la celda estará viva en la próxima generación, por lo que podríamos estar violando el principio [SRP](https://es.wikipedia.org/wiki/Principio_de_responsabilidad_%C3%BAnica) y ésta abarcaría más responsabilidades de las que debería tener.
- **World**: Si añadimos la funcionalidad aquí, parece que esta clase empezaría a convertirse en una [God Class](https://es.wikipedia.org/wiki/Objeto_todopoderoso).

Ahora que hemos analizado las dos alternativas, podemos retomar la abstracción que implementamos en el anterior capítulo:

{% highlight ruby linenos %}
class Location
  attr_reader :x, :y
end
{% endhighlight %}

¿No os parece que el mejor sitio para añadir esta nueva funcionalidad es dentro de este nuevo objeto?

{% highlight ruby linenos %}
class Location
  attr_reader :x, :y
  def neighbors
    #...
  end
end
{% endhighlight %}

Esto es a lo que llama Corey Haines “Behavior attractors”, puesto que está nueva abstracción **atrae de forma natural** la nueva funcionalidad. Como norma, podemos decir que siempre que nos entren dudas sobre **dónde colocar una nueva funcionalidad**, es posible que necesitemos **crear nuevas abstracciones** porque hay algún concepto en nuestro sistema que no está expresado correctamente.