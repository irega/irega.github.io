---
layout: post
title: Principios de diseño (11)
subtitle: Inverted composition as a Replacement for Inheritance
tags: [Software design]
---

Y para ir finalizando la serie de capítulos sobre el libro de Corey Haines, vamos con el último capítulo donde nos enseña la técnica de **inversión de la composición** para evitar duplicidades.

Vamos con un caso práctico. Tenemos dos tipos de mascota: un perro y un gato. Cada uno tiene sus comportamientos específicos, pero por ejemplo tenemos una restriccion, su nombre no puede ser mayor de 255 caracteres. Lo diseñamos inicialmente de esta forma:

{% highlight typescript linenos %}
class Cat {
    private rules: PetValidationRules;
    constructor(public name: string) { }
    isValid(): boolean { return this.rules.validate(this); }
    doSomeCatStuff(): void { }
}
 
class Dog {
    private rules: PetValidationRules;
    constructor(public name: string) { }
    isValid(): boolean { return this.rules.validate(this); }
    doSomeDogStuff(): void { }
}
 
class PetValidationRules {
    validate(pet: Cat | Dog): boolean {
        return pet.name.length <= 255;
    }
}
{% endhighlight %}

Enseguida nos damos cuenta de que tenemos código duplicado, toda la lógica de validación está repetida en las dos clases. La decisión más inmediata y más comun que solemos tomar es **utilizar herencia** para eliminar el código duplicado:

{% highlight typescript linenos %}
class Pet {
    rules: PetValidationRules;
    constructor(public name: string) { }
    isValid(): boolean {
        return true;
    }
}
 
class Cat extends Pet {
    isValid(): boolean { return this.rules.validate(this); }
    doSomeCatStuff(): void { }
}
 
class Dog extends Pet {
    isValid(): boolean { return this.rules.validate(this); }
    doSomeDogStuff(): void { }
}
 
class PetValidationRules {
    validate(pet: Pet): boolean {
        return pet.name.length <= 255;
    }
}
{% endhighlight %}

Pero, aunque utilizamos herencia, el objeto “PetValidationRules” está **instanciado dos veces** y presente en los objetos “Cat” y “Dog”. Es decir, tenemos dos clases (“Cat” y “Dog”) **dependiendo de una** (“PetValidationRules”). También la clase “Pet” **puede seguir creciendo** en el futuro, y podemos equivocarnos añadiendo más **comportamientos y funcionalidades que no sean responsabilidad suya** y que las clases “Cat” y “Dog” los arrastren.

Para solucionar esto, Corey Haines nos propone **invertir la composición**:

{% highlight typescript linenos %}
class PetValidationRules {
    pet: Pet;
    validate(): boolean {
        return this.pet.name.length <= 255;
    }
}
 
interface Pet {
    name: string;
}
 
class Cat implements Pet {
    name: string;
    doSomeCatStuff(): void { }
}
 
class Dog implements Pet {
    name: string;
    doSomeDogStuff(): void { }
}
{% endhighlight %}

De esta forma, ahora tenemos **una única clase** “PetValidationRules” **dependiendo de una interfaz**, que puede ser implementada por dos clases distintas. Además, sólo hay **un único método de validación** en la clase que corresponde (PetValidationRules) y no está repartido por el resto de clases.

Y otra cosa positiva es que **la clase que más suele cambiar** (¿cuantas veces nos ha cambiado el cliente las reglas de validación de nuestra aplicación?) está la primera en la cadena de dependencias, es decir, **no tiene ninguna dependencia**. De esta forma evitamos que por mucho que cambie, impacte a sus consumidores. Siempre deberíamos intentar que las clases y objetos que más pueden cambiar sean referenciados por el minimo número de objetos posibles.