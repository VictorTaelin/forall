const F = require(".");

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

