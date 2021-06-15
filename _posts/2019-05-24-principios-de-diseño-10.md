---
layout: post
title: Principios de diseño (10)
subtitle: Unwrapping an Object
tags: [Software design]
---

En uno de los últimos capítulos del libro, Corey Haines nos explica como suele aplicar el principio de “Tell, Don’t ask” cuando está diseñando objetos. En este [enlace](https://www.adictosaltrabajo.com/2012/07/21/orientacion-a-objetos-y-la-importancia-del-tell-dont-ask/) explica perfectamente este principio, mucho mejor de lo que podría hacerlo yo 😀

{: .box-note}
El «**Tell, Don’t ask**» es un meme que nos recuerda que no tenemos que usar los objetos para pedirles cosas y según la información que nos devuelven tomar decisiones, sino que lo que debemos hacer es decirles a los objetos que hagan cosas y estos objetos internamente tomaran sus propias decisiones según de su estado.

Para cumplir dicho principio, sigue la potente restricción de que **ninguna función debe retornar ningún valor**. Esto lo que implica es que un objeto no debería exponer propiedades internas para que otros objetos las consuman, ya que esto podría ser considerado un método accesor y estaríamos retornando un valor y delegando la funcionalidad que es responsabilidad de nuestro objeto al consumidor.

Uno de los casos que más dudas genera esta última recomendación sería el típico método “equals” para comprobar si dos objetos del mismo tipo son iguales. La primera implementación que se nos ocurriría podría ser:

{% highlight typescript linenos %}
class Person {
    constructor(public name: string,
        public surname: string) { }
 
    equals(other_person: Person): boolean {
        return other_person.name === this.name && other_person.surname === this.surname;
    }
}
{% endhighlight %}

Pero si la examinamos detenidamente, aunque se trata de un objeto del mismo tipo, estamos accediendo a las propiedades internas de uno de ellos desde el otro. Para solucionar esto, Corey Haines aplica lo que llama la técnica de **“unwrapping”** (desenvolver):

{% highlight typescript linenos %}
class Person {
    constructor(private name: string,
        private surname: string) { }
 
    equals(other_person: Person): boolean {
        return other_person.equalsUnwrapped(this.name, this.surname);
    }
 
    equalsUnwrapped(name: string, surname: string): boolean {
        return this.name === name && this.surname === surname;
    }
}
{% endhighlight %}

Con esta técnica extrae (desenvuelve) las propiedades necesarias del objeto y las convierte en parámetros de una función. Esta función será llamada sobre uno de los objetos, con el valor de las propiedades internas del otro, solucionando así el problema de responsabilidad.

A pesar de esta última refactorización, seguimos teniendo una función que está retornando un valor binario y hemos dicho que no deberíamos retornar ningún valor. Esto es fácil de solucionar, en nuestro caso necesitamos saber si un objeto es igual que otro para tomar una decisión, por ejemplo ejecutar un código u otro. Pues podríamos delegar esta decisión en el propio objeto que realiza la comprobación, por ejemplo proprocionándole en el mismo método el código a ejecutar en cada caso:

{% highlight typescript linenos %}
class Person {
    constructor(private name: string,
        private surname: string) { }
 
    equals(other_person: Person): void {
        let counter = 0;
        other_person.equalsUnwrapped(this.name, this.surname,
            () => {
                counter++;
            }, () => {
                counter--;
            });
    }
 
    equalsUnwrapped(name: string, surname: string,
        if_equal: () => void, if_not_equal: () => void): void {
 
        if (this.name === name && this.surname === surname) {
            if_equal();
        } else {
            if_not_equal();
        }
    }
}
{% endhighlight %}