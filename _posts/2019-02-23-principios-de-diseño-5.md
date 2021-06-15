---
layout: post
title: Principios de diseño (5)
subtitle: Don’t have tests depend on previous tests
tags: [Software design]
---

Esta vez, vamos a partir del ejemplo de cuentas bancarias sobre el que hablamos en el [capítulo anterior]({% post_url 2019-02-17-principios-de-diseño-4 %}). Modificando el test unitario con el que terminamos:

{% highlight typescript linenos %}
import { BankAccount } from "../original/BankAccount";
 
describe("The bank account", () => {
 
  describe("when customer does a transfer">, () => {
 
    it("should decrease its balance from an account with 0 balance", () => {
      const a_bank_account = new BankAccount();
      const irrelevant_transfer_amount = 100;
 
      a_bank_account.doTransfer(irrelevant_transfer_amount);
 
      expect(a_bank_account.balance).toEqual(0 - irrelevant_transfer_amount);
    });
 
  });
 
});
{% endhighlight %}

Estamos probando que el balance de una cuenta bancaria, **que inicialmente parte de un saldo 0**, se ve disminuido cuando el usuario realiza una transferencia. El test parece correcto, pero, ¿no estamos presuponiendo demasiadas cosas?

¿Que pasa si el día de mañana el constructor por defecto de “BankAccount” no devuelve una cuenta bancaria con saldo 0? ¿Y si cambiamos los parámetros del constructor por defecto? Efectivamente, nuestro test empezaría a fallar, **dándonos información difusa de lo que está fallando en nuestro sistema**.

En este caso deberíamos hacer un test independiente para comprobar que una nueva “BankAccount” parte de un balance inicial de 0. Así, si en el futuro modificamos el constructor sólo fallará este nuevo test, acotándonos bastante el problema.

Por otro lado, deberemos modificar nuestro test original para **no depender del test que hemos comentado previamente**, partiendo explícitamente del estado que queremos:

{% highlight typescript linenos %}
import { BankAccount } from "../original/BankAccount";
 
describe("The bank account", () => {
 
  describe("when customer does a transfer", () => {
 
    it("should decrease its balance from an account with 0 balance", () => {
      const a_bank_account = BankAccount.with_balance_0(); // Given.a_bank_account_with_0_balance();
      const irrelevant_transfer_amount = 100;
 
      a_bank_account.doTransfer(irrelevant_transfer_amount);
 
      expect(a_bank_account.balance).toEqual(0 - irrelevant_transfer_amount);
    });
 
  });
 
});
{% endhighlight %}