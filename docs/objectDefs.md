# Object Definitions
In this style, microgrammars are defined in JavaScript objects, with the matcher properties matched in turn as the input is evaluated. The result type will have the same property names (excluding fields whose name begins with `_`, which are only available for computations during parsing), but the types will be whatever the matchers returns. This type can be specified in the type parameter to the microgrammar definition.

For example:

```typescript
const mg = Microgrammar.fromDefinitions<{name: string, age: number}>({
    name: /[a-zA-Z0-9]+/,
    _col: ":",
    age: Integer
});
```

This grammar can be used as follows:

```typescript
const results = mg.findMatches("-celine:61 greg*^ tom::: mandy:11");
assert(result.length === 2);
const first = results[0];
assert(first.$matched === "celine:61");
// The offset of this match was the 1st character, as the 0th was discarded
assert(first.$offset === 1);
assert(first.name === "celine");
assert(first.age === 61);
```
Object definitions can be composed.

The rules for handling fields in object definitions are as follows:

- Normally named property
	- If type is `string`, literal matcher matching the property's value
	- If type is JavaScript `RegExp` (specified within `/.../` or constructed literally), match the given regular expression
	- If type implements `MatchingLogic`, use that matcher
- Property with a name beginning with `_`: Private property. Match using conversion rules as above, but do not expose in the result. Such properties are used to compute published properties.
- Property with a name beginning with `$`, such as `$lazy`: Ignored for matching purposes. Used to control behavior of matching: for example, how to treat whitespace.
- Normally named function taking context as argument: Bind the computed result to the context
- Function taking context as an argument whose name starts with `_`: Validation function. Returning false will veto a match.


The *context* is built up during each match, and has each property bound, including private properties. 