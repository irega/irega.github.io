---
layout: post
title: Principios de diseño (7)
subtitle: Naive duplication
tags: [Software design]
---

Desde que empezamos a programar, nuestros profesores siempre nos han intentado inculcar la idea de **unificación y reutilización de código** para evitar siempre el famoso “copy-paste”. En nuestro afán de unificar código similar, hay a veces que vamos demasiado rápido y podemos empeorar el diseño de nuestro código, dificultando el mantenimiento o la extensibilidad del producto en el futuro.

Como es habitual en esta sección, ¡vamos con un ejemplo!. Imaginaros una función que nos dice si debemos o no contratar a un candidato que ha aplicado en una oferta de trabajo de nuestra empresa. Querremos contratarle si tenemos suficiente dinero y tiene conocimientos de C# o JavaScript, o si no tenemos dinero, al menos que sepa JavaScript:

{% highlight typescript linenos %}
function hireCandidate(mainSkill: string): boolean {
  if (iHaveEnoughMoney()) {
    return mainSkill === "c#" || mainSkill === "javascript";
  }
  else {
    return mainSkill === "javascript";
  }
}
{% endhighlight %}

Lo más habitual es que detectemos claramente el código duplicado y los unifiquemos de esta forma:

{% highlight typescript linenos %}
function hireCandidate(mainSkill: string): boolean {
  return (iHaveEnoughMoney() && mainSkill === "c#") || mainSkill === "javascript";
}
{% endhighlight %}

Si echamos un vistazo a principios de diseño como [DRY (Don’t Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), efectivamente nos incita entre otras cosas a eliminar código duplicado. Pero no tenemos que centrarnos siempre en la implementación, también tenemos que evitar la duplicación de conceptos, comportamientos o funcionalidades.

Por tanto, si nos ponemos a examinar detenidamente el código original, podemos agrupar el código en dos **conceptos totalmente diferentes**, queremos contratar un perfil Fullstack si tenemos suficiente dinero, y si no, un perfil Frontend:

{% highlight typescript linenos %}
function hireCandidate(mainSkill: string): boolean {
  if (iHaveEnoughMoney()) {
    return isAFullstackProfile(mainSkill);
  }
  else {
    return isAFrontendProfile(mainSkill);
  }
}
{% endhighlight %}

¿Qué ganamos con esto? Pues principalmente que al no mezclar la implementación de dos conceptos totalmente diferentes, si en el futuro hay que modificar uno de ellos, el otro **no debería verse afectado**. Además el código es mucho más **legible y mantenible**, sabré rápidamente en qué punto tengo que realizar la modificación.