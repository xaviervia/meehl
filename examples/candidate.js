var meehl = require("../meehl");

meehl("candidate", function (grade, percentage, value) {
  console.log("The candidate received a " + grade)
  console.log("The percentage value is " + percentage + "% for a total of " +
              value)
});
