var meehl = require("../meehl")

meehl.inquire({
  name: "Testing",
  description: "Just a test",
  scores: [
    {
      topic: "Boredom",
      questions: [
        "How much bored are you?"
      ],
      value: 5
    }
  ]
}, function (grade) {
  console.log(grade)
})
