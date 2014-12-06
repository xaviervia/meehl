// Meehl
// =====
//
// Meehl formulas processor.
//
//
// Installation
// ------------
//
// ```
// npm install -g meehl
// ```
//
// Usage
// -----
//
// First you need to make sure the corresponding formula package is available.
//
// ```
// npm install -g meehl-candidate
// ```
//
// Then run:
//
// ```
// meehl candidate
// ```
//
// Meehl loads the formula in the npm package named `meehl-candidate` and
// prompts the user for input as required by the formula. When the user
// finishes filling out the form, it logs the results in form of grades,
// percentage points and total value as reported by **meehl**.
//
// To consume Meehl programatically, do:
//
// ```javascript
// var meehl = require("meehl")
//
// meehl("candidate", function (grade, percentage, value) {
//  console.log("The " + process.argv[2] + " received a " + grade)
//  console.log("That is the " + percentage + "% of " + value)
// })
// ```
//
// Formula
// -------
//
// The Formula is expected to be an object containing a `scores` property with
// an array of Scores. Each score itself has a `topic` that is the title of the
// score, a set of `questions` that function as guidelines for the score and
// a `value` that states the integer value of the score in the total formula.
//
// A formula may also have a name and description, althought since formulas
// are shipped as `npm` packages this will be redundant with the `package.json`
// name and description fields.
//
// A sample formula would be:
//
// ```json
// {
//   "name": "Sith candidate",
//   "description": "A rational approach to the selection of the next Darth",
//   "scores": [
//     {
//       "topic": "Evilness",
//       "questions": [
//         "Is she/he naturally evil?",
//         "Has he/she already performed seriously evil feats?"
//       ],
//       "value": 6
//     },
//     {
//       "topic": "Style",
//       "questions": [
//         "Does she/he naturally favors black capes?",
//         "Does he/she wears something red to accentuate his evil status?"
//       ],
//       "value": 6
//     }
//   ]
// }
// ```
//
// #### Argument
//
// - `Object` option
// - `Function` callback
//
// #### Callback
//
// - `String` grade
// - `Integer` percentage
// - `Integer` value
//
"use strict"

var inquirer = require("inquirer")
var color    = require("cli-color")

inquirer.prompts.input.prototype.prefix = function( str ) {
  str || (str = "");
  return "\n" + str;
};

var bluebird = require("bluebird")

var prompt = bluebird.promisify(inquirer.prompt)

var meehl = function (formula, callback) {

  //! Loads the formula and inquires it
  meehl.inquire(
    require("meehl-" + formula),
    callback
  )
}

// ### meehl.inquire
//
// #### Arguments
//
// - `Object` formula
//   - `String` name
//   - `String` description
//   - `Array` scores
//     - `String` topic
//     - `Array<String>` questions
//     - `Integer` value
// - `Function` callback
//
meehl.inquire = function (formula, callback) {
  if (formula.name) {
    console.log("\n" + color.bold(color.blue(formula.name)))
    var equals = ""
    for (var i = 0; i < formula.name.length; i ++)
      equals += "="
    console.log(color.blue(equals) + "\n")
  }

  if (formula.description)
    console.log("> " + formula.description)

  var inquire = formula.scores.map(function (score, index) {
    var message = score.topic + "\n"
    for (var i = 0; i < score.topic.length; i ++)
      message += "-"
    message += "\n\n - "
    message += color.bold(score.questions.join("\n - "))
    message += color.blue("\n\n[0-" + score.value + "]")

    return {
      type: "input",
      name: "score-" + index,
      message: message,
      validate: function( value ) {
        return value <= score.value ||
          "Please enter a number between 0 and " + score.value
      },
      filter: Number
    }
  })

  meehl.process(prompt(inquire), formula, callback)
}

meehl.process = function (promise, formula, callback) {
  promise.catch(function (result) {
    var total = 0
    formula.scores.forEach(function (score) {
      total += score.value
    })

    var sum = 0
    Object.keys(result).forEach(function (key) {
      sum += result[key]
    })

    var grade = sum > total * .95 ? "A+" : (
                sum > total * .9 ? "A" : (
                sum > total * .85 ? "A-" : (
                sum > total * .8 ? "B+" : (
                sum > total * .75 ? "B" : (
                sum > total * .7 ? "B-" : (
                sum > total * .65 ? "C+" : (
                sum > total * .6 ? "C" : (
                sum > total * .55 ? "C-" : (
                sum > total * .5 ? "D+" : (
                sum > total * .45 ? "D" : (
                sum > total * .4 ? "D-" : (
                sum > total * .35 ? "E+" : (
                sum > total * .3 ? "E" : (
                sum > total * .25 ? "E-" : (
                sum > total * .2 ? "F+" : (
                sum > total * .15 ? "F" : (
                sum > total * .1 ? "F-" : "G")))))))))))))))))
    callback(grade, (sum / total) * 100, total)
  })
}

module.exports = meehl

// License
// -------
//
// Copyright (c) 2014, Xavier Via
//
// BSD 2 Clause license
// See [license](LICENSE) file attached.
//
