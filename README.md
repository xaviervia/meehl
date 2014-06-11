Meehl
=====

Meehl formulas processor. TODO Eventually will run from command line


Installation
------------

```
npm install meehl
```

Usage
-----

First you need to make sure the corresponding formula package is available.

```
npm install meehl-candidate
```

Then run:

```js
var meehl = require("meehl");

meehl("candidate", function (grade, percentage, value) {
  console.log("The candidate received a " + grade)
  console.log("The percentage value is " + percentage + "% for a total of " +
              value)
});
```

The snippet loads the formula in the npm package named `meehl-candidate` and
prompts the user for input as required by the formula. When the user
finishes filling out the form, it logs the results in form of grades,
percentage points and total value as reported by **meehl**.

Formula
-------

The Formula is expected to be an object containing a `scores` property with
an array of Scores. Each score itself has a `topic` that is the title of the
score, a set of `questions` that function as guidelines for the score and
a `value` that states the integer value of the score in the total formula.

A formula may also have a name and description, althought since formulas
are shipped as `npm` packages this will be redundant with the `package.json`
name and description fields.

A sample formula would be:

```json
{
  "name": "Sith candidate",
  "description": "A rational approach to the selection of the next Darth",
  "scores": [
    {
      "topic": "Evilness",
      "questions": [
        "Is she/he naturally evil?",
        "Has he/she already performed seriously evil feats?"
      ],
      "value": 6
    },
    {
      "topic": "Style",
      "questions": [
        "Does she/he naturally favors black capes?",
        "Does he/she wears something red to accentuate his evil status?"
      ],
      "value": 6
    }
  ]
}
```

#### Argument

- `Object` option
- `Function` callback

#### Callback

- `String` grade
- `Integer` percentage
- `Integer` value

### meehl.inquire

#### Arguments

- `Object` formula
  - `String` name
  - `String` description
  - `Array` scores
    - `String` topic
    - `Array<String>` questions
    - `Integer` value
- `Function` callback

License
-------

Copyright (c) 2014, Xavier Via

BSD 2 Clause license
See [license](LICENSE) file attached.
