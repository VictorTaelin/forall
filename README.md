# Forall.js

Expressive static type and invariant checks for JavaScript. It is similar to [TypeScript](https://www.typescriptlang.org), but:

1. Has very precise types such as `the type of hex-encoded strings with an even number of characters` (i.e., `new Buffer()`'s input), and can **statically** check all of them;

2. Has invariants such as `for any user and any item, purchase(user,item).balance >= 0`, so that, if you forget to check the balance in your `purchase(User,Item)` implementation, it becomes a **compile-time error**;

3. Requires no additional compilation step: it works like a macro on top of vanilla JS, using [Node.js](https://nodejs.org/en/) as the "compiler", and then erasing itself out.

Yes, it can check claims such as *"this function can't produce negative balances"* **at compile time**. Sounds magical, but it is actually simple: the catch is that it isn't doing classical (logical) type-checking, but, instead, it "type-checks" by inspecting with random samples. It can, thus, be wrong sometimes. The hypothesis, though, is that, in practice, if your code is wrong, it will almost always spot it; and being wrong sometimes is compensated by catching a much larger class of bugs.

In short, `Forall.js` attempts to give you some of the expressivity of [Idris](https://www.idris-lang.org), with the ease-of-use of [TypeScript](https://www.typescriptlang.org), trading absolute for probabilistic correctness. You can see it as the fusion of a type system with automated tests.

## Examples

Use-cases can be simple, such as statically checking that you implemented a function correctly (w.r.t specification):

```javascript
const F = require("forall");

// Returns the largest element of an array, or 0
const maximum = F(
  F.Fn(F.Array(F.Uint32), F.Uint32), // function from Array<Uint32> to Uint32
  function(array) {
    let max = 0;
    for (let i = 0; i < array.length; ++i)
      max = Math.max(array[i], max);
    return max;
  });

// "the largest element of any array should be larger than or equal to any of its elements"
F.forall([F.Array(F.Uint32), F.Uint16], (array, i) => maximum(array) >= (array[i % array.length] || 0));
```

Or very complex, such as checking the second functor law on an implementation of `.map`:

```javascript
const F = require("forall");

// Gives a static type to JavaScript's `.map` function
//   map :: ∀ a b -> (a -> b) -> [a] -> [b]
const map = (A, B) => F(
  F.Fn(F.Fn(A, B), F.Array(A), F.Array(B)),
  (f, array) => array.map(f));

// Statically checks the second functor law on `map`
//   ∀ (A : Type)   -> ∀ (B : Type)   -> ∀ (C : Type) ->
//   ∀ (f : B -> C) -> ∀ (g : A -> B) -> ∀ (a : Array<A>) ->
//   map<B,C>(f, map<A,B>(g, a)) == map<A,C>(f . g, a)
F.forall([F.Type, F.Type, F.Type], (A, B, C) => {
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const mapAB = map(A,B), mapBC = map(B,C), mapAC = map(A,C);
  return F.forall([F.Fn(B,C), F.Fn(A,B), F.Array(A)], (f, g, a) => {
    return equal(mapBC(f, mapAB(g, a)), mapAC(x => f(g(x)), a))
  }, 32); 
}, 4);
```

Once the checking is done, your program behaves the same as if `Forall.js` wasn't there, except also doing additional runtime checks. You, then, have two options: you can export the original functions, **allowing dead-code-elimination to erase all `Forall.js` code from your final bundles**, or you can export the typed functions, **allowing your library users to see informative error messages if they use your functions incorrectly**.

## Installing

    npm i forall

## Learning

The best way to learn Forall.js is by following the [Forall.js game](game.js).

## Disclaimer

This is still very new and immature. The code, although short, is very messy and there is a lot to improve.
