---
layout: post
title: Principios de diseño (4)
subtitle: Testing State vs Testing Behavior
tags: [Software design]
---

Cuando comenzamos a diseñar nuestro sistema o a extenderlo con una nueva funcionalidad, empezamos a definir las abstracciones y los tipos de objetos necesarios. Seguidamente, dotamos de funcionalidad y miembros internos a estas nuevas clases. El problema es que la mayoría de las veces no nos paramos a pensar detenidamente **cuál es el comportamiento (behavior) de nuestro sistema que necesita** estos nuevos objetos que estamos definiendo.

Esto nos puede llevar a diseñar nuestros componentes con funcionalidad no necesaria o demasiado compleja por ejemplo. Por ello, siempre deberíamos **orientar el desarrollo de nuestro sistema a comportamiento** o funcionalidades.

Para entender mejor esto, he intentado elaborar un ejemplo lo más simple posible. Imaginaros que estamos definiendo en nuestro sistema el comportamiento de una cuenta bancaria. Inicialmente pensamos en que la cuenta bancaria tiene que tener un balance que debe poder incrementarse y disminuirse:

{% highlight typescript linenos %}
export class BankAccount {
    constructor(public balance: number = 0) {
        this.balance = balance;
    }
 
    increaseBalance(amount: number) {
        this.balance += amount;
    }
 
    decreaseBalance(amount: number) {
        this.balance -= amount;
    }
}
{% endhighlight %}

Y si realizamos sus correspondientes tests unitarios:

{% highlight typescript linenos %}
import { BankAccount } from "../original/BankAccount";
 
describe("The bank account", () => {
    let a_bank_account: BankAccount;
    const irrelevant_amount = 100;
 
    beforeEach(() => {
        a_bank_account = new BankAccount();
    });
 
    it("should increase its balance", () => {
        const original_balance = a_bank_account.balance;
 
        a_bank_account.increaseBalance(irrelevant_amount);
 
        expect(a_bank_account.balance).toBeGreaterThan(original_balance);
    });
 
    it("should decrease its balance", () => {
        const original_balance = a_bank_account.balance;
 
        a_bank_account.decreaseBalance(irrelevant_amount);
 
        expect(a_bank_account.balance).toBeLessThan(original_balance);
    });
 
});
{% endhighlight %}

Parece un diseño bastante correcto, rápido y simple. En estos tests **estamos probando que el estado** del componente (balance) se ve modificado al realizar ciertas acciones. Pero, ¿por qué vamos a tener que aumentar o disminuir el saldo de nuestra cuenta bancaria? **¿cuál es el comportamiento que lo va a necesitar?**

Una posible respuesta es que necesitamos disminuir el saldo de nuestra cuenta cuando realicemos una transferencia. O necesitaremos que nuestro saldo se vea incrementado cuando recibamos un ingreso. Esos son los dos comportamientos que deberíamos implementar y **a donde debería estar orientado nuestro diseño**.

Por tanto, refactorizamos nuestro diseño inicial:

{% highlight typescript linenos %}
export class BankAccount {
    constructor(public balance: number = 0) {
        this.balance = balance;
    }
 
    doTransfer(amount: number) {
        this.balance -= amount;
    }
}
{% endhighlight %}

Y sus tests:

{% highlight typescript linenos %}
import { BankAccount } from "./BankAccount";
 
describe("The bank account", () => {
 
    describe("when customer does a transfer", () => {
 
        it("should decrease its balance", () => {
            const a_bank_account = new BankAccount();
            const previous_balance = a_bank_account.balance;
            const irrelevant_transfer_amount = 100;
 
            a_bank_account.doTransfer(irrelevant_transfer_amount);
 
            expect(a_bank_account.balance).toEqual(previous_balance - irrelevant_transfer_amount);
        });
 
    });
 
});
{% endhighlight %}

Y ahora vemos que estamos probando este comportamiento y no el estado del objeto. Esto nos lleva a un diseño mucho más sencillo y orientado a la funcionalidad que realmente necesita el sistema.