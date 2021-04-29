---
layout: post
title: Principios de diseño (1)
subtitle: Test names should influence object’s API
tags: [Software design]
---

Bueno, después de un año bastante ajetreado entre boda, luna de miel, viajes, cambio de empresa, etc. he podido sacar algún que otro hueco para retomar otros proyectos personales como este blog.

Últimamente me he centrado más en recordar y reforzar los principios básicos de desarrollo de software, tanto de diseño como de testing, ya que éstos suelen marcar la diferencia entre un software extensible, mantenible y de calidad y otro que no lo es, independientemente de la tecnología utilizada para su implementación.

Quería empezar escribiendo una serie de artículos basados en el primer libro que me estoy leyendo: [Understanding the Four Rules of Simple Design by Corey Haines](https://leanpub.com/4rulesofsimpledesign)

Este libro se basa en las 4 reglas de diseño simple enunciadas por Kent Beck en los años 90 (ordenados de mayor a menor prioridad):

1. **Tests Pass**: Nuestro código debe ejecutar correctamente todos los tests.
2. **Expresses Intent**: El código tiene que ser fácil de entender.
3. **No Duplication**: No duplicar funcionalidad.
4. **Small**: Minimizar el número de elementos como clases y métodos.

Después de esta pequeña introducción, vamos con el primer concepto:

{: .box-note}
Test names should influence object’s API

Lo primero que se nos recuerda en este capítulo, es que a veces olvidamos que los tests de nuestra aplicación, además de servirnos para saber si algo está fallando en nuestro sistema, persiguen el objetivo de ser la **documentación viva de nuestro proyecto**, expresando a la perfección la funcionalidad actual que tenemos implementada.

La idea principal que se intenta transmitir es que el nombre de un test, además de tener que **expresar claramente lo que se está probando**, debe influenciar a la API del objeto con el que se trabaja. Esto lo podemos ver mejor con el siguiente ejemplo:

{% highlight ruby linenos %}
def test_a_new_world_is_empty
  world = World.new
  assert_equal 0, world.living_cells.count
end
{% endhighlight %}
	
En este test, se quiere comprobar que un nuevo objeto de tipo “World” es vacío. A primera vista puede parecer que el test es totalmente válido, pero, ¿realmente estamos probando que un nuevo objeto “World” es vacío? La respuesta es no, estamos probando que un contador interno del objeto “World” tiene un valor específico (0).

Refactorizando el test:

{% highlight ruby linenos %}
def test_a_new_world_is_empty
  world = World.new
  assert_true world.empty?
end
{% endhighlight %}

De esta forma, el nombre del nuevo método de la clase “World” expresa totalmente lo que estamos probando en el test, además de **encapsular la implementación** interna del objeto.

Con esta encapsulación conseguimos que el resto de componentes de nuestro sistema tengan disponible una API para interactuar con el objeto, sin tener que acceder a su implementación. Podemos pensar en el test como el primer consumidor de nuestro objeto.

Además, evitamos que cuando modifiquemos la implementación del objeto, si la funcionalidad sigue siendo correcta, los tests empiecen a fallar. Esto es una gran ventaja desde el punto de vista de eficiencia al desarrollar.

¡Hasta el siguiente capítulo!