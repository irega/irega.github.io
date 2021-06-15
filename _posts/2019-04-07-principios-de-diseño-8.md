---
layout: post
title: Principios de diseño (8)
subtitle: Procedural Polymorphism
tags: [Software design]
---

Vuelvo a la carga después de casi un mes sin escribir! Esta vez quería analizar el que es para mí uno de los capítulos más importantes del libro de Corey Haines, ya que nos ayuda a evitar/solucionar uno de los errores de diseño que solemos cometer/encontrarnos con más frecuencia en nuestro día a día.

Este error de diseño lo ha bautizado Corey como **Polimorfismo procedimental**. De forma muy resumida, este tipo de polimorfismo se da cuando implementamos los distintos comportamientos/ramificaciones de nuestro sistema haciendo uso de sentencias condicionales tipo “if” imperativas y procedimentales. ¿Cómo lo solucionamos? Utilizando el polimorfismo de toda la vida, el que usamos en programación orientada a objetos y conocemos como **Polimorfismo basado en tipos**.

Para entenderlo mucho más rápido, podemos refactorizar el ejemplo del capítulo anterior, en el que se usaba un polimorfismo procedimental:

{% highlight typescript linenos %}
function hireCandidate(mainSkill: string): boolean {
  if (iHaveEnoughMoney()) {
   return isAFullstackProfile(mainSkill);
  } else {
   return isAFrontendProfile(mainSkill);
  }
}
{% endhighlight %}

Como podemos apreciar, la sentencia “if” crea dos ramificaciones en el código, para diferenciar cuando se debe contratar a un candidato en el caso de una empresa rica (iHaveEnoughMoney = true) y una pobre. Si aplicamos el polimorfismo correcto:

{% highlight typescript linenos %}
class RichCompany {
    hireCandidate(mainSkill: string): boolean {
        return this.isAFullstackProfile(mainSkill);
    }
 
    private isAFullstackProfile(mainSkill: string): boolean {
        return mainSkill === "c#" || mainSkill === "javascript";
    }
}
 
class PoorCompany {
    hireCandidate(mainSkill: string): boolean {
        return this.isAFrontendProfile(mainSkill);
    }
 
    private isAFrontendProfile(mainSkill: string): boolean {
        return mainSkill === "javascript";
    }
}
{% endhighlight %}

Podemos definir de forma explícita los dos tipos de empresa con sus correspondientes comportamientos. ¿Qué conseguimos con esta refactorización?:

- **Extensibilidad**: Si en el futuro llega un nuevo tipo de empresa bastará con definir un nuevo tipo para representarla. Con el código original tendríamos que seguir aumentando nuestra cadena de sentencias if-else.

- **Encapsulación**: Si en el futuro hay que modificar alguno de los dos comportamientos evitaremos tocar en el mismo punto del código e impactar en el otro. Además, ayudaremos a evitar la duplicación de la misma ramificación de código/funcionalidad en otras partes de nuestro sistema, ya que sabremos que tenemos este tipo definido de forma explícita y que atrae de forma natural esta funcionalidad.

