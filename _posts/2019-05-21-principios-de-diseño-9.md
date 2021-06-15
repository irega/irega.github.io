---
layout: post
title: Principios de diseño (9)
subtitle: Making assumptions about usage
tags: [Software design]
---

El siguiente capítulo del libro de Corey Haines se titula “Making Assumptions About Usage”, o lo que es lo mismo, “Haciendo suposiciones sobre el uso”. Y es que muchas veces, cuando diseñamos abstracciones, asumimos ciertos usos que se les va a dar en el futuro, definiendo por ejemplo abstracciones o métodos que nunca llegan a ser utilizados. Por ello, se nos recomienda **partir del diseño más simple** que podamos y que cumpla con la funcionalidad que necesitamos, y a posterior, podremos **ir refactorizándolo** a medida que vayamos necesitando más funcionalidad.

Un ejemplo más práctico: imaginemos que estamos empezando a definir las entidades dentro del dominio de nuestra aplicación. Estamos definiendo una clase “Persona”, y pensamos que es buena idea empezar a definir los métodos que pueden sernos útiles en el futuro. Por ejemplo, un método que comprueba si la persona tiene tantos hijos como para ser considerada una familia numerosa:

{% highlight typescript linenos %}
class Person {
    constructor(
        public name: string,
        public surname: string,
        public age: number
    ) { }
 
    isALargeFamily(numberOfChildren: number): boolean {
        return numberOfChildren >= 3;
    }
}
{% endhighlight %}

A priori parece un diseño válido, pero si tenemos en cuenta que los métodos definidos en las entidades deberían ser **métodos que interactuan con el estado interno** de la entidad de alguna manera, en este caso únicamente se trabaja con el parámetro recibido en la función.

Podemos mejorar el diseño creando una nueva abstracción “FamilyRules” que contenga las reglas correspondientes a una familia y moviendo dentro el método anterior. De esta forma **separamos responsabilidades y aligeramos** la clase “Persona”:

{% highlight typescript linenos %}
class FamilyRules {
    isALargeFamily(numberOfChildren: number): boolean {
        return numberOfChildren >= 3;
    }
}
{% endhighlight %}