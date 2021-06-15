---
layout: post
title: Principios de diseño (6)
subtitle: Breaking Abstraction Level
tags: [Software design]
---

En en este [post anterior]({% post_url 2019-01-20-principios-de-diseño-2 %}) vimos porqué era una mala práctica duplicar el conocimiento de la topología interna de un objeto por diferentes partes de nuestro sistema, y cómo solucionarla. En este nuevo capítulo, veremos que **romper el nivel de abstracción** tendrá las mismas consecuencias.

Examinando el ejemplo orientado a tests elaborado por **Corey Haines**:

{% highlight ruby linenos %}
def test_world_is_not_empty_after_adding_a_cell
  world = World.empty
  world.set_living_at(Location.new(1,1))
  assert_false world.empty?
end
{% endhighlight %}

Podemos comprobar que con la sentencia **“Location.new(1,1)”** estamos rompiendo el nivel de abstracción, puesto que el objeto World empieza a tener conocimiento de la implementación interna del objeto Location. La consecuencia de esto es que si en el futuro **cambiamos la topología** del sistema de coordenadas (por ejemplo añadir una nueva dimensión z), **romperíamos tests** que no deberían estar relacionados.

Para solucionar este caso específico, podríamos por ejemplo ocultar la implementación interna de Location exponiendo una propiedad que actúe como builder de una coordenada específica (**Location.center**):

{% highlight ruby linenos %}
def test_world_is_not_empty_after_adding_a_cell
  world = World.empty
  world.set_living_at(Location.center)
  assert_false world.empty?
end
{% endhighlight %}

Y sería aún más mejorable utilizando un **test double** en vez del objeto real, con lo que reduciríamos el nivel de acoplamiento del test con la clase Location y sólo definiríamos la funcionalidad que necesita dicho test.