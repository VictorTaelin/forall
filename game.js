const F = require(".");
const ___ = null;

// Welcome to the Forall learning game!
// 1. Clone this repository
// 2. Run this with `node game.js`
// 3. Read the type error
// 4. Fill the ___s until this file "compiles"
// 5. You won!
// 6. ...
// 7. Goodbye bugs?



// Base types
const b0 = F(F.Number, ___);
const b1 = F(F.Boolean, ___);
const b2 = F(F.String, ___);




// Numeric types
const n0 = F(F.Uint8, ___);
const n1 = F(F.Int8, ___);
const n2 = F(F.Uint32, ___);
const n3 = F(F.Uint(2), ___);
const n4 = F(F.Between(1.3, 1.7), ___);
const n5 = F(F.IntBetween(16, 19), ___);




// String types
const s0 = F(F.Bytes, ___);
const s1 = F(F.Date, ___);




// Array types
const a0 = F(F.Array(F.String), ["Alice", "Bob", ___]);
const a1 = F(F.Array(F.Number), [1, 2, 3, ___]);
const a2 = F(F.Vector(4, F.Number), [1, 2, 3, ___]); // Arrays of exactly 4 elements




// Enums
const Weapon = F.Enum(
  "Sword", "Lance", "Axe",
  "Knife", "Staff", "Bow"
).__name("Weapon"); // you can name types for better errors

const w0 = F(Weapon, ___);
const w1 = F(Weapon, ___);
const w2 = F(Weapon, ___);




// Structs
const Player = F.Struct({
  atk: F.Number,
  def: F.Number,
  wpn: Weapon,
  bag: F.Array(F.String),
}).__name("Player");

const p0 = F(Player ,{
  atk: ___,
  def: 14,
  wpn: ___,
  bag: ["rope", ___]
});
  



// Functions
const add = F(
  F.Fn(F.Number, F.Number, F.Number),
  function(a, b) {
    return ___;
  });

const reverse = F(
  F.Fn(F.Array(F.Number), F.Array(F.Number)),
  function(array) {
    return ___;
  });

const concat = F(
  F.Fn(F.String, F.String, F.String),
  function(a, b) { 
    return ___;
  });




// Invariants
// a.k.a. did you cheat on the implementations above?

// "addition associates"
F.forall([F.Number, F.Number],
  (a,b) => add(a,b) === add(b,a));

// "last element is the first after reverse"
F.forall([F.Array(F.Number)],
  (a) => a.lenght === 0 || a[0] === reverse(a)[a.length-1]);

// "concatenation adds lengths"
F.forall([F.String, F.String],
  (a, b) => concat(a,b).length === a.length + b.length);

// "concatenation commutes"
F.forall([F.String, F.String, F.String],
  (a, b, c) => concat(concat(a,b),c) === concat(a,concat(b,c)));




// Custom types

const DigimonName = F(F.Type, {

  // a human-readable description on how to construct an element of that type
  form: "a plain JavaScript String ending with 'mon'",

  // tests whether `x` is an inhabitant of this type
  test: x => F.String.test(x) && x.slice(-3) === "mon",

  // produces a random inhabitant of this type (if s is true, return a readable value)
  rand: s => F.String.rand(s) + "mon"

}).__name("DigitmonName");

const digimonify = F(
  F.Fn(F.String, DigimonName),
  function(name) {
    return ___;
  });




// Polymorphism
// Possible, but checking can only happen when you instance solid values.

const map = (A, B) => F(
  F.Fn(F.Fn(A, B), F.Array(A), F.Array(B)), // ∀ a . ∀ b . (a -> b) -> [a] -> [b]
  function(f, array) {
    let result = [];
    for (let i = 0; i < array.length; ++i)
      result.push(___);
    return result;
  })

map(F.Number, F.String);
map(F.Number, F.Boolean);




// The Pokémon example

const Fype = F.Enum(
  "normal" , "fight"   , "flying" , "poison"   ,
  "ground" , "rock"    , "bug"    , "ghost"    ,
  "steel"  , "fire"    , "water"  , "grass"    ,
  "dragon" , "psychic" , "ice"    , "electric" ,
  "dark"   , "fairy"
).__name("Type");

const Stat = F.Enum(
  "hp"  , "atk" , "def",
  "spe" , "spa" , "spd"
).__name("Stat");

const Pokemon = F.Struct({
  name: F.String,
  number: F.Uint16,
  types: F.Pair(Fype, F.Maybe(Fype)),
  attacks: F.Vector(4, F.String),
  stats: F.Struct({
    hp: F.Uint8,
    atk: F.Uint8,
    def: F.Uint8,
    spe: F.Uint8,
    spa: F.Uint8,
    spd: F.Uint8
  })
}).__name("Pokemon");

const highestStat = F(
  F.Fn(Pokemon, F.Uint8),
  function(poke) { 
    return Math.max(
      poke.stats.hp,
      poke.stats.atk,
      ___,
      poke.stats.spe,
      poke.stats.spa,
      poke.stats.spd); 
  })

F.forall([Pokemon, Stat], (poke, stat) => highestStat(poke) >= poke.stats[stat]);




// OK that's it. A last challenge:

const sort = F(
  F.Fn(F.Array(F.Uint8), F.Array(F.Uint8)),
  function(nums) {
    return ___;
  }
);

// "sorting an array doesn't change its length"
F.forall([F.Array(F.Uint8)],
  (arr) => arr.length === sort(arr).length);

// "sorting an array doesn't change its elements"
F.forall([F.Array(F.Uint8), F.Uint8],
  (arr, i) => !arr[i] || sort(arr).indexOf(arr[i]) !== -1);

// "in a sorted array, arr[i] < arr[i + 1]"
F.forall([F.Array(F.Uint8), F.Uint8], (arr, uint) => {
  if (arr.length <= 1) return true;
  const i = uint % (arr.length - 1);
  const s = sort(arr);
  return s[i] <= s[i + 1];
});




// You just used .sort(), didn't you?
// OK, then, THIS is your last challenge.

// "a sorted array is not sorted"
F.forall([F.Array(F.Uint8)],
  (array) => JSON.stringify(sort(array)) !== JSON.stringify(array.sort()));

// (wutt)
// Create a function that satisfies my specification
// of `sort`, but isn't actually a sorting function.
// (I'm not sure if that is possible.)

console.log("If you're seeing this after only changing ___s, you've won the game! Sadly, you also lost The Game.");
console.log("I hope this tool improves your coding life! :)");
